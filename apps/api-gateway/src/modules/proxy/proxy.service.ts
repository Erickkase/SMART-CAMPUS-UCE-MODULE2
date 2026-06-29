import {
  BadGatewayException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

type RouteTarget = {
  externalPrefix: string;
  serviceUrl: string;
  upstreamPrefix: string;
};

type CircuitState = {
  failureCount: number;
  openedAt: number | null;
};

@Injectable()
export class ProxyService {
  private readonly circuitStates = new Map<string, CircuitState>();
  private readonly timeoutMs: number;
  private readonly failureThreshold: number;
  private readonly resetTimeoutMs: number;

  constructor(private readonly configService: ConfigService) {
    this.timeoutMs =
      this.configService.get<number>('circuitBreaker.timeoutMs') ?? 5000;
    this.failureThreshold =
      this.configService.get<number>('circuitBreaker.failureThreshold') ?? 3;
    this.resetTimeoutMs =
      this.configService.get<number>('circuitBreaker.resetTimeoutMs') ?? 15000;
  }

  async forward(request: Request, response: Response): Promise<void> {
    const target = this.resolveTarget(request.originalUrl);
    if (!target) {
      throw new NotFoundException('Gateway route was not found');
    }

    this.assertCircuitClosed(target.externalPrefix);

    const upstreamUrl = this.buildUpstreamUrl(request.originalUrl, target);
    const headers = this.buildHeaders(request);
    const body = this.shouldForwardBody(request.method) ? request.body : undefined;
    const abortController = new AbortController();
    const timeout = setTimeout(() => abortController.abort(), this.timeoutMs);

    try {
      const upstreamResponse = await fetch(upstreamUrl, {
        method: request.method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: abortController.signal,
      });

       clearTimeout(timeout);

       if (upstreamResponse.status >= 500) {
        this.registerFailure(target.externalPrefix);
       } else {
        this.resetCircuit(target.externalPrefix);
       }

      const responseBody = await upstreamResponse.text();

      upstreamResponse.headers.forEach((value, key) => {
        if (!['content-encoding', 'content-length', 'transfer-encoding'].includes(key)) {
          response.setHeader(key, value);
        }
      });

      response.status(upstreamResponse.status).send(responseBody);
    } catch (error) {
      clearTimeout(timeout);
      this.registerFailure(target.externalPrefix);

      if (error instanceof Error && error.name === 'AbortError') {
        throw new ServiceUnavailableException('Upstream service request timed out');
      }

      throw new BadGatewayException(
        error instanceof Error ? error.message : 'Upstream service is unavailable',
      );
    }
  }

  private assertCircuitClosed(key: string): void {
    const state = this.circuitStates.get(key);

    if (!state || state.openedAt === null) {
      return;
    }

    if (Date.now() - state.openedAt >= this.resetTimeoutMs) {
      this.resetCircuit(key);
      return;
    }

    throw new ServiceUnavailableException(
      `Circuit breaker is open for route ${key}`,
    );
  }

  private registerFailure(key: string): void {
    const state = this.circuitStates.get(key) ?? {
      failureCount: 0,
      openedAt: null,
    };

    state.failureCount += 1;

    if (state.failureCount >= this.failureThreshold) {
      state.openedAt = Date.now();
    }

    this.circuitStates.set(key, state);
  }

  private resetCircuit(key: string): void {
    this.circuitStates.set(key, {
      failureCount: 0,
      openedAt: null,
    });
  }

  private resolveTarget(originalUrl: string): RouteTarget | null {
    const targets: RouteTarget[] = [
      {
        externalPrefix: '/api/scholarships',
        serviceUrl: this.configService.get<string>('services.scholarship') ?? '',
        upstreamPrefix: '/scholarships',
      },
      {
        externalPrefix: '/api/socioeconomic-forms',
        serviceUrl: this.configService.get<string>('services.socioeconomic') ?? '',
        upstreamPrefix: '/socioeconomic-forms',
      },
      {
        externalPrefix: '/api/psychological-care',
        serviceUrl: this.configService.get<string>('services.psychological') ?? '',
        upstreamPrefix: '/psychological-care',
      },
      {
        externalPrefix: '/api/subjects',
        serviceUrl: this.configService.get<string>('services.subject') ?? '',
        upstreamPrefix: '/subjects',
      },
      {
        externalPrefix: '/api/enrollments',
        serviceUrl: this.configService.get<string>('services.enrollment') ?? '',
        upstreamPrefix: '/enrollments',
      },
      {
        externalPrefix: '/api/students',
        serviceUrl: this.configService.get<string>('services.student') ?? '',
        upstreamPrefix: '/students',
      },
    ];

    return targets.find((target) => originalUrl.startsWith(target.externalPrefix)) ?? null;
  }

  private buildUpstreamUrl(originalUrl: string, target: RouteTarget): string {
    const [path, query] = originalUrl.split('?');
    const suffix = path.slice(target.externalPrefix.length);
    const upstreamPath = `${target.upstreamPrefix}${suffix}`;
    const baseUrl = target.serviceUrl.replace(/\/$/, '');

    return `${baseUrl}${upstreamPath}${query ? `?${query}` : ''}`;
  }

  private buildHeaders(request: Request): HeadersInit {
    const headers: Record<string, string> = {};

    for (const [key, value] of Object.entries(request.headers)) {
      if (typeof value === 'string' && !['host', 'content-length'].includes(key)) {
        headers[key] = value;
      }
    }

    headers['content-type'] = headers['content-type'] ?? 'application/json';
    return headers;
  }

  private shouldForwardBody(method: string): boolean {
    return !['GET', 'HEAD'].includes(method.toUpperCase());
  }
}

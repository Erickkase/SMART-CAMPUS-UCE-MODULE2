import { BadGatewayException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

type RouteTarget = {
  externalPrefix: string;
  serviceUrl: string;
  upstreamPrefix: string;
};

@Injectable()
export class ProxyService {
  constructor(private readonly configService: ConfigService) {}

  async forward(request: Request, response: Response): Promise<void> {
    const target = this.resolveTarget(request.originalUrl);
    if (!target) {
      throw new NotFoundException('Gateway route was not found');
    }

    const upstreamUrl = this.buildUpstreamUrl(request.originalUrl, target);
    const headers = this.buildHeaders(request);
    const body = this.shouldForwardBody(request.method) ? request.body : undefined;

    try {
      const upstreamResponse = await fetch(upstreamUrl, {
        method: request.method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
      });

      const responseBody = await upstreamResponse.text();

      upstreamResponse.headers.forEach((value, key) => {
        if (!['content-encoding', 'content-length', 'transfer-encoding'].includes(key)) {
          response.setHeader(key, value);
        }
      });

      response.status(upstreamResponse.status).send(responseBody);
    } catch (error) {
      throw new BadGatewayException(
        error instanceof Error ? error.message : 'Upstream service is unavailable',
      );
    }
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

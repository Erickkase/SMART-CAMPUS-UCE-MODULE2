import { Injectable } from '@nestjs/common';
import {
  Counter,
  Registry,
  collectDefaultMetrics,
  register,
} from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly registry: Registry = register;
  private readonly httpRequestsTotal: Counter<string>;

  constructor() {
    collectDefaultMetrics({ register: this.registry, prefix: 'smart_campus_gateway_' });

    this.httpRequestsTotal = new Counter({
      name: 'smart_campus_gateway_http_requests_total',
      help: 'Total HTTP requests handled by api-gateway',
      labelNames: ['method', 'route', 'status_code'],
      registers: [this.registry],
    });
  }

  recordHttpRequest(method: string, route: string, statusCode: number): void {
    this.httpRequestsTotal.inc({
      method,
      route,
      status_code: String(statusCode),
    });
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  getContentType(): string {
    return this.registry.contentType;
  }
}

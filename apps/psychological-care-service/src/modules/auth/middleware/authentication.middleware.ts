// Placeholder middleware for future cross-cutting authentication processing.
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  use(_request: Request, _response: Response, next: NextFunction): void {
    // Placeholder for future cross-cutting authentication concerns.
    next();
  }
}

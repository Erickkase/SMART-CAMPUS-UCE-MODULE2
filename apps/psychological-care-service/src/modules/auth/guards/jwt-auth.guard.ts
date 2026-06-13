// Protects routes with JWT validation when AUTH_ENABLED=true and bypasses auth when disabled.
import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const authEnabled = this.configService.get<boolean>('authEnabled') ?? false;

    if (!authEnabled) {
      return true;
    }

    return super.canActivate(context);
  }
}

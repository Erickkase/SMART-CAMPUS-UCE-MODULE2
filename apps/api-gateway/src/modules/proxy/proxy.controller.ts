import { All, Controller, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProxyService } from './proxy.service';

@ApiTags('Gateway')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('api')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @All('*path')
  @ApiOperation({ summary: 'Proxy REST requests to Module 2 microservices' })
  async proxy(@Req() request: Request, @Res() response: Response): Promise<void> {
    await this.proxyService.forward(request, response);
  }
}

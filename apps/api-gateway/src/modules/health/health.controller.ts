import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('api/health')
export class HealthController {
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'API Gateway health check' })
  @ApiOkResponse({
    description: 'Gateway is healthy',
    schema: { example: { status: 'ok', service: 'api-gateway' } },
  })
  getHealth(): { status: string; service: string } {
    return { status: 'ok', service: 'api-gateway' };
  }
}

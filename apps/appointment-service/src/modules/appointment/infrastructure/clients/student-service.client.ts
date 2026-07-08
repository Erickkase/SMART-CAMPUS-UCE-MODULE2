import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StudentServiceClient {
  constructor(private readonly configService: ConfigService) {}

  async validateStudentExists(studentId: string): Promise<void> {
    const validationEnabled =
      this.configService.get<boolean>('studentValidationEnabled') ?? true;

    if (!validationEnabled) {
      return;
    }

    const baseUrl =
      this.configService.get<string>('services.student') ??
      'http://localhost:3006';
    const url = `${baseUrl.replace(/\/$/, '')}/students/${studentId}`;

    try {
      const response = await fetch(url, { method: 'GET' });

      if (response.status === 404) {
        throw new NotFoundException(
          `Student with id ${studentId} was not found`,
        );
      }

      if (!response.ok) {
        throw new BadGatewayException(
          `Student service returned status ${response.status}`,
        );
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadGatewayException(
        error instanceof Error
          ? `Student service is unavailable: ${error.message}`
          : 'Student service is unavailable',
      );
    }
  }
}

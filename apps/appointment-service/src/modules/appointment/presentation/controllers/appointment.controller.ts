import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { JwtPayload } from '../../../auth/interfaces/jwt-payload.interface';
import { AppointmentService } from '../../application/services/appointment.service';
import { CreateAppointmentDto } from '../../application/dtos/create-appointment.dto';
import { UpdateAppointmentDto } from '../../application/dtos/update-appointment.dto';
import { UpdateAppointmentStatusDto } from '../../application/dtos/update-appointment-status.dto';
import { Appointment } from '../../domain/entities/appointment.entity';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create psychological care appointment' })
  @ApiBody({ type: CreateAppointmentDto })
  @ApiCreatedResponse({
    description: 'Appointment created successfully',
    schema: {
      example: {
        id: '38b11c67-604a-4f1d-88f5-f7a7f06fce8e',
        studentId: '2f6f25c5-5df3-45e7-8f6f-3396a3ac4cf5',
        psychologistId: '9c6ef28c-c551-427f-b8c0-cf8261598513',
        scheduledAt: '2026-07-10T14:00:00.000Z',
        reason: 'Initial consultation for academic stress',
        status: 'PENDING',
        createdAt: '2026-06-01T12:00:00.000Z',
        updatedAt: '2026-06-01T12:00:00.000Z',
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid request payload' })
  @ApiNotFoundResponse({ description: 'Student not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  createAppointment(
    @Body() createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    return this.appointmentService.createAppointment(createAppointmentDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'List appointments' })
  @ApiOkResponse({
    description: 'Appointment list returned successfully',
    schema: {
      example: [
        {
          id: '38b11c67-604a-4f1d-88f5-f7a7f06fce8e',
          studentId: '2f6f25c5-5df3-45e7-8f6f-3396a3ac4cf5',
          psychologistId: '9c6ef28c-c551-427f-b8c0-cf8261598513',
          scheduledAt: '2026-07-10T14:00:00.000Z',
          reason: 'Initial consultation for academic stress',
          status: 'PENDING',
          createdAt: '2026-06-01T12:00:00.000Z',
          updatedAt: '2026-06-01T12:00:00.000Z',
        },
      ],
    },
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getAppointments(
    @CurrentUser() _currentUser?: JwtPayload,
  ): Promise<Appointment[]> {
    return this.appointmentService.getAppointments();
  }

  @Get('students/:studentId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'List appointments by student id' })
  @ApiParam({ name: 'studentId', format: 'uuid' })
  @ApiOkResponse({
    description: 'Student appointment list returned successfully',
    schema: {
      example: [
        {
          id: '38b11c67-604a-4f1d-88f5-f7a7f06fce8e',
          studentId: '2f6f25c5-5df3-45e7-8f6f-3396a3ac4cf5',
          psychologistId: '9c6ef28c-c551-427f-b8c0-cf8261598513',
          scheduledAt: '2026-07-10T14:00:00.000Z',
          reason: 'Initial consultation for academic stress',
          status: 'PENDING',
          createdAt: '2026-06-01T12:00:00.000Z',
          updatedAt: '2026-06-01T12:00:00.000Z',
        },
      ],
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid student id' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getAppointmentsByStudentId(
    @Param('studentId', new ParseUUIDPipe()) studentId: string,
  ): Promise<Appointment[]> {
    return this.appointmentService.getAppointmentsByStudentId(studentId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get appointment by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({
    description: 'Appointment returned successfully',
    schema: {
      example: {
        id: '38b11c67-604a-4f1d-88f5-f7a7f06fce8e',
        studentId: '2f6f25c5-5df3-45e7-8f6f-3396a3ac4cf5',
        psychologistId: '9c6ef28c-c551-427f-b8c0-cf8261598513',
        scheduledAt: '2026-07-10T14:00:00.000Z',
        reason: 'Initial consultation for academic stress',
        status: 'CONFIRMED',
        createdAt: '2026-06-01T12:00:00.000Z',
        updatedAt: '2026-06-01T15:00:00.000Z',
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid appointment id' })
  @ApiNotFoundResponse({ description: 'Appointment not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getAppointmentById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Appointment> {
    return this.appointmentService.getAppointmentById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update appointment fields' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ type: UpdateAppointmentDto })
  @ApiOkResponse({ description: 'Appointment updated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request payload or id' })
  @ApiNotFoundResponse({ description: 'Appointment not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  updateAppointment(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    return this.appointmentService.updateAppointment(id, updateAppointmentDto);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update appointment status' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ type: UpdateAppointmentStatusDto })
  @ApiOkResponse({ description: 'Appointment status updated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid status transition or id' })
  @ApiNotFoundResponse({ description: 'Appointment not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  updateAppointmentStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateAppointmentStatusDto: UpdateAppointmentStatusDto,
  ): Promise<Appointment> {
    return this.appointmentService.updateAppointmentStatus(
      id,
      updateAppointmentStatusDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete appointment by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Appointment deleted successfully' })
  @ApiBadRequestResponse({ description: 'Invalid appointment id' })
  @ApiNotFoundResponse({ description: 'Appointment not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async deleteAppointment(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    await this.appointmentService.deleteAppointment(id);
  }
}

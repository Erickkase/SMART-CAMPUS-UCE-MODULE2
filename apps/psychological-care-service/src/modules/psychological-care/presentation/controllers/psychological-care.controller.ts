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
import {
  ApiBadRequestResponse,
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
import { CreatePsychologicalAppointmentDto } from '../../application/dtos/create-psychological-appointment.dto';
import { CreatePsychologicalFollowUpDto } from '../../application/dtos/create-psychological-follow-up.dto';
import { CreatePsychologicalReferralDto } from '../../application/dtos/create-psychological-referral.dto';
import { CreatePsychologicalRequestDto } from '../../application/dtos/create-psychological-request.dto';
import { UpdatePsychologicalAppointmentStatusDto } from '../../application/dtos/update-psychological-appointment-status.dto';
import { UpdatePsychologicalReferralStatusDto } from '../../application/dtos/update-psychological-referral-status.dto';
import { UpdatePsychologicalRequestStatusDto } from '../../application/dtos/update-psychological-request-status.dto';
import { PsychologicalCareService } from '../../application/services/psychological-care.service';
import { PsychologicalAppointment } from '../../domain/entities/psychological-appointment.entity';
import { PsychologicalFollowUp } from '../../domain/entities/psychological-follow-up.entity';
import { PsychologicalReferral } from '../../domain/entities/psychological-referral.entity';
import { PsychologicalRequest } from '../../domain/entities/psychological-request.entity';
import { CurrentUser } from '../../../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { JwtPayload } from '../../../auth/interfaces/jwt-payload.interface';

@ApiTags('Psychological Care')
@UseGuards(JwtAuthGuard)
@Controller('psychological-care')
export class PsychologicalCareController {
  constructor(private readonly psychologicalCareService: PsychologicalCareService) {}

  @Post('requests')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create psychological care request' })
  @ApiBody({ type: CreatePsychologicalRequestDto })
  @ApiCreatedResponse({ description: 'Psychological request created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request payload' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  createRequest(
    @Body() createRequestDto: CreatePsychologicalRequestDto,
    @CurrentUser() _currentUser?: JwtPayload,
  ): Promise<PsychologicalRequest> {
    return this.psychologicalCareService.createRequest(createRequestDto);
  }

  @Get('requests')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List psychological care requests' })
  @ApiOkResponse({ description: 'Psychological request list returned successfully' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getRequests(): Promise<PsychologicalRequest[]> {
    return this.psychologicalCareService.getRequests();
  }

  @Get('requests/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get psychological care request by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Psychological request returned successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request id' })
  @ApiNotFoundResponse({ description: 'Psychological request not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getRequestById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<PsychologicalRequest> {
    return this.psychologicalCareService.getRequestById(id);
  }

  @Patch('requests/:id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update psychological care request status' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ type: UpdatePsychologicalRequestStatusDto })
  @ApiOkResponse({ description: 'Psychological request status updated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request payload or id' })
  @ApiNotFoundResponse({ description: 'Psychological request not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  updateRequestStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateRequestStatusDto: UpdatePsychologicalRequestStatusDto,
  ): Promise<PsychologicalRequest> {
    return this.psychologicalCareService.updateRequestStatus(id, updateRequestStatusDto);
  }

  @Delete('requests/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete psychological care request by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Psychological request deleted successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request id' })
  @ApiNotFoundResponse({ description: 'Psychological request not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async deleteRequest(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.psychologicalCareService.deleteRequest(id);
  }

  @Post('appointments')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create psychological care appointment' })
  @ApiBody({ type: CreatePsychologicalAppointmentDto })
  @ApiCreatedResponse({ description: 'Psychological appointment created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request payload' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  createAppointment(
    @Body() createAppointmentDto: CreatePsychologicalAppointmentDto,
  ): Promise<PsychologicalAppointment> {
    return this.psychologicalCareService.createAppointment(createAppointmentDto);
  }

  @Get('appointments')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List psychological care appointments' })
  @ApiOkResponse({ description: 'Psychological appointment list returned successfully' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getAppointments(): Promise<PsychologicalAppointment[]> {
    return this.psychologicalCareService.getAppointments();
  }

  @Get('appointments/student/:studentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List psychological care appointments by student id' })
  @ApiParam({ name: 'studentId', format: 'uuid' })
  @ApiOkResponse({ description: 'Psychological appointments returned successfully' })
  @ApiBadRequestResponse({ description: 'Invalid student id' })
  @ApiNotFoundResponse({ description: 'Psychological appointments not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getAppointmentsByStudentId(
    @Param('studentId', new ParseUUIDPipe()) studentId: string,
  ): Promise<PsychologicalAppointment[]> {
    return this.psychologicalCareService.getAppointmentsByStudentId(studentId);
  }

  @Patch('appointments/:id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update psychological care appointment status' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ type: UpdatePsychologicalAppointmentStatusDto })
  @ApiOkResponse({ description: 'Psychological appointment status updated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request payload or id' })
  @ApiNotFoundResponse({ description: 'Psychological appointment not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  updateAppointmentStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateAppointmentStatusDto: UpdatePsychologicalAppointmentStatusDto,
  ): Promise<PsychologicalAppointment> {
    return this.psychologicalCareService.updateAppointmentStatus(
      id,
      updateAppointmentStatusDto,
    );
  }

  @Post('follow-ups')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create psychological care follow-up' })
  @ApiBody({ type: CreatePsychologicalFollowUpDto })
  @ApiCreatedResponse({ description: 'Psychological follow-up created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request payload' })
  @ApiNotFoundResponse({ description: 'Psychological appointment not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  createFollowUp(
    @Body() createFollowUpDto: CreatePsychologicalFollowUpDto,
  ): Promise<PsychologicalFollowUp> {
    return this.psychologicalCareService.createFollowUp(createFollowUpDto);
  }

  @Get('follow-ups/student/:studentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List psychological care follow-ups by student id' })
  @ApiParam({ name: 'studentId', format: 'uuid' })
  @ApiOkResponse({ description: 'Psychological follow-ups returned successfully' })
  @ApiBadRequestResponse({ description: 'Invalid student id' })
  @ApiNotFoundResponse({ description: 'Psychological follow-ups not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getFollowUpsByStudentId(
    @Param('studentId', new ParseUUIDPipe()) studentId: string,
  ): Promise<PsychologicalFollowUp[]> {
    return this.psychologicalCareService.getFollowUpsByStudentId(studentId);
  }

  @Post('referrals')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create psychological care referral' })
  @ApiBody({ type: CreatePsychologicalReferralDto })
  @ApiCreatedResponse({ description: 'Psychological referral created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request payload' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  createReferral(
    @Body() createReferralDto: CreatePsychologicalReferralDto,
  ): Promise<PsychologicalReferral> {
    return this.psychologicalCareService.createReferral(createReferralDto);
  }

  @Get('referrals/student/:studentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List psychological care referrals by student id' })
  @ApiParam({ name: 'studentId', format: 'uuid' })
  @ApiOkResponse({ description: 'Psychological referrals returned successfully' })
  @ApiBadRequestResponse({ description: 'Invalid student id' })
  @ApiNotFoundResponse({ description: 'Psychological referrals not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getReferralsByStudentId(
    @Param('studentId', new ParseUUIDPipe()) studentId: string,
  ): Promise<PsychologicalReferral[]> {
    return this.psychologicalCareService.getReferralsByStudentId(studentId);
  }

  @Patch('referrals/:id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update psychological care referral status' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ type: UpdatePsychologicalReferralStatusDto })
  @ApiOkResponse({ description: 'Psychological referral status updated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request payload or id' })
  @ApiNotFoundResponse({ description: 'Psychological referral not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  updateReferralStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateReferralStatusDto: UpdatePsychologicalReferralStatusDto,
  ): Promise<PsychologicalReferral> {
    return this.psychologicalCareService.updateReferralStatus(id, updateReferralStatusDto);
  }
}

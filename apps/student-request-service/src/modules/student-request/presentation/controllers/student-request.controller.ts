import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateStudentRequestDto } from '../../application/dtos/create-student-request.dto';
import { UpdateStudentRequestDto } from '../../application/dtos/update-student-request.dto';
import { UpdateStudentRequestStatusDto } from '../../application/dtos/update-student-request-status.dto';
import { StudentRequestService } from '../../application/services/student-request.service';
import { StudentRequest } from '../../domain/entities/student-request.entity';

@ApiTags('Student Requests')
@Controller('student-requests')
export class StudentRequestController {
  constructor(private readonly studentRequestService: StudentRequestService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create student request' })
  @ApiBody({ type: CreateStudentRequestDto })
  @ApiCreatedResponse({ description: 'Student request created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request payload' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  createStudentRequest(@Body() createDto: CreateStudentRequestDto): Promise<StudentRequest> {
    return this.studentRequestService.createStudentRequest(createDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List student requests' })
  @ApiOkResponse({ description: 'Student request list returned successfully' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getStudentRequests(): Promise<StudentRequest[]> {
    return this.studentRequestService.getStudentRequests();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get student request by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Student request returned successfully' })
  @ApiBadRequestResponse({ description: 'Invalid student request id' })
  @ApiNotFoundResponse({ description: 'Student request not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getStudentRequestById(@Param('id', new ParseUUIDPipe()) id: string): Promise<StudentRequest> {
    return this.studentRequestService.getStudentRequestById(id);
  }

  @Get('student/:studentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List student requests by student id' })
  @ApiParam({ name: 'studentId', format: 'uuid' })
  @ApiOkResponse({ description: 'Student requests returned successfully' })
  @ApiBadRequestResponse({ description: 'Invalid student id' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getStudentRequestsByStudentId(@Param('studentId', new ParseUUIDPipe()) studentId: string): Promise<StudentRequest[]> {
    return this.studentRequestService.getStudentRequestsByStudentId(studentId);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update student request' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ type: UpdateStudentRequestDto })
  @ApiOkResponse({ description: 'Student request updated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request payload or id' })
  @ApiNotFoundResponse({ description: 'Student request not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  updateStudentRequest(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateDto: UpdateStudentRequestDto): Promise<StudentRequest> {
    return this.studentRequestService.updateStudentRequest(id, updateDto);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update student request status' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ type: UpdateStudentRequestStatusDto })
  @ApiOkResponse({ description: 'Student request status updated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request payload or id' })
  @ApiNotFoundResponse({ description: 'Student request not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  updateStudentRequestStatus(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateStatusDto: UpdateStudentRequestStatusDto): Promise<StudentRequest> {
    return this.studentRequestService.updateStudentRequestStatus(id, updateStatusDto.status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete student request' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Student request deleted successfully' })
  @ApiBadRequestResponse({ description: 'Invalid student request id' })
  @ApiNotFoundResponse({ description: 'Student request not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async deleteStudentRequest(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.studentRequestService.deleteStudentRequest(id);
  }
}

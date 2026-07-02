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
import { CreateEnrollmentDto } from '../../application/dtos/create-enrollment.dto';
import { UpdateEnrollmentDto } from '../../application/dtos/update-enrollment.dto';
import { EnrollmentService } from '../../application/services/enrollment.service';
import { Enrollment } from '../../domain/entities/enrollment.entity';

@ApiTags('Enrollments')
@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create enrollment' })
  @ApiBody({ type: CreateEnrollmentDto })
  @ApiCreatedResponse({ description: 'Enrollment created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request payload' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  createEnrollment(
    @Body() createEnrollmentDto: CreateEnrollmentDto,
  ): Promise<Enrollment> {
    return this.enrollmentService.createEnrollment(createEnrollmentDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List enrollments' })
  @ApiOkResponse({ description: 'Enrollment list returned successfully' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getEnrollments(): Promise<Enrollment[]> {
    return this.enrollmentService.getEnrollments();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get enrollment by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Enrollment returned successfully' })
  @ApiBadRequestResponse({ description: 'Invalid enrollment id' })
  @ApiNotFoundResponse({ description: 'Enrollment not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getEnrollmentById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Enrollment> {
    return this.enrollmentService.getEnrollmentById(id);
  }

  @Get('student/:studentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List enrollments by student id' })
  @ApiParam({ name: 'studentId', format: 'uuid' })
  @ApiOkResponse({ description: 'Student enrollments returned successfully' })
  @ApiBadRequestResponse({ description: 'Invalid student id' })
  @ApiNotFoundResponse({ description: 'Student enrollments not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getEnrollmentsByStudentId(
    @Param('studentId', new ParseUUIDPipe()) studentId: string,
  ): Promise<Enrollment[]> {
    return this.enrollmentService.getEnrollmentsByStudentId(studentId);
  }

  @Get('subject/:subjectId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List enrollments by subject id' })
  @ApiParam({ name: 'subjectId', format: 'uuid' })
  @ApiOkResponse({ description: 'Subject enrollments returned successfully' })
  @ApiBadRequestResponse({ description: 'Invalid subject id' })
  @ApiNotFoundResponse({ description: 'Subject enrollments not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getEnrollmentsBySubjectId(
    @Param('subjectId', new ParseUUIDPipe()) subjectId: string,
  ): Promise<Enrollment[]> {
    return this.enrollmentService.getEnrollmentsBySubjectId(subjectId);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update enrollment' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ type: UpdateEnrollmentDto })
  @ApiOkResponse({ description: 'Enrollment updated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request payload or id' })
  @ApiNotFoundResponse({ description: 'Enrollment not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  updateEnrollment(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateEnrollmentDto: UpdateEnrollmentDto,
  ): Promise<Enrollment> {
    return this.enrollmentService.updateEnrollment(id, updateEnrollmentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete enrollment' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Enrollment deleted successfully' })
  @ApiBadRequestResponse({ description: 'Invalid enrollment id' })
  @ApiNotFoundResponse({ description: 'Enrollment not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async deleteEnrollment(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.enrollmentService.deleteEnrollment(id);
  }
}

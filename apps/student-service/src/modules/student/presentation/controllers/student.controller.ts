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
import { CreateStudentDto } from '../../application/dtos/create-student.dto';
import { UpdateStudentDto } from '../../application/dtos/update-student.dto';
import { StudentService } from '../../application/services/student.service';
import { Student } from '../../domain/entities/student.entity';

@ApiTags('Students')
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create student' })
  @ApiBody({ type: CreateStudentDto })
  @ApiCreatedResponse({ description: 'Student created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request payload' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  createStudent(@Body() createStudentDto: CreateStudentDto): Promise<Student> {
    return this.studentService.createStudent(createStudentDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List students' })
  @ApiOkResponse({ description: 'Student list returned successfully' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getStudents(): Promise<Student[]> {
    return this.studentService.getStudents();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get student by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Student returned successfully' })
  @ApiBadRequestResponse({ description: 'Invalid student id' })
  @ApiNotFoundResponse({ description: 'Student not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getStudentById(@Param('id', new ParseUUIDPipe()) id: string): Promise<Student> {
    return this.studentService.getStudentById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update student' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ type: UpdateStudentDto })
  @ApiOkResponse({ description: 'Student updated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request payload or id' })
  @ApiNotFoundResponse({ description: 'Student not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  updateStudent(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    return this.studentService.updateStudent(id, updateStudentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete student' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Student deleted successfully' })
  @ApiBadRequestResponse({ description: 'Invalid student id' })
  @ApiNotFoundResponse({ description: 'Student not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async deleteStudent(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.studentService.deleteStudent(id);
  }
}

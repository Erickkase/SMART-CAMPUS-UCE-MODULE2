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
import { CreateSubjectDto } from '../../application/dtos/create-subject.dto';
import { UpdateSubjectDto } from '../../application/dtos/update-subject.dto';
import { SubjectService } from '../../application/services/subject.service';
import { Subject } from '../../domain/entities/subject.entity';

@ApiTags('Subjects')
@Controller('subjects')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create subject' })
  @ApiBody({ type: CreateSubjectDto })
  @ApiCreatedResponse({ description: 'Subject created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request payload' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  createSubject(@Body() createSubjectDto: CreateSubjectDto): Promise<Subject> {
    return this.subjectService.createSubject(createSubjectDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List subjects' })
  @ApiOkResponse({ description: 'Subject list returned successfully' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getSubjects(): Promise<Subject[]> {
    return this.subjectService.getSubjects();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get subject by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Subject returned successfully' })
  @ApiBadRequestResponse({ description: 'Invalid subject id' })
  @ApiNotFoundResponse({ description: 'Subject not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getSubjectById(@Param('id', new ParseUUIDPipe()) id: string): Promise<Subject> {
    return this.subjectService.getSubjectById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update subject' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ type: UpdateSubjectDto })
  @ApiOkResponse({ description: 'Subject updated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request payload or id' })
  @ApiNotFoundResponse({ description: 'Subject not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  updateSubject(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ): Promise<Subject> {
    return this.subjectService.updateSubject(id, updateSubjectDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete subject' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Subject deleted successfully' })
  @ApiBadRequestResponse({ description: 'Invalid subject id' })
  @ApiNotFoundResponse({ description: 'Subject not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async deleteSubject(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.subjectService.deleteSubject(id);
  }
}

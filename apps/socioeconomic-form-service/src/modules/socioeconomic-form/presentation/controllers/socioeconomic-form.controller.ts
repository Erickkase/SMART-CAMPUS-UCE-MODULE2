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
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateSocioeconomicFormDto } from '../../application/dtos/create-socioeconomic-form.dto';
import { UpdateSocioeconomicFormDto } from '../../application/dtos/update-socioeconomic-form.dto';
import { SocioeconomicFormService } from '../../application/services/socioeconomic-form.service';
import { SocioeconomicForm } from '../../domain/entities/socioeconomic-form.entity';

@ApiTags('Socioeconomic Forms')
@Controller('socioeconomic-forms')
export class SocioeconomicFormController {
  constructor(
    private readonly socioeconomicFormService: SocioeconomicFormService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a socioeconomic form' })
  @ApiBody({ type: CreateSocioeconomicFormDto })
  @ApiCreatedResponse({ description: 'Socioeconomic form created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request payload' })
  createSocioeconomicForm(
    @Body() createDto: CreateSocioeconomicFormDto,
  ): Promise<SocioeconomicForm> {
    return this.socioeconomicFormService.createSocioeconomicForm(createDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List socioeconomic forms' })
  @ApiOkResponse({ description: 'Socioeconomic forms returned successfully' })
  getSocioeconomicForms(): Promise<SocioeconomicForm[]> {
    return this.socioeconomicFormService.getSocioeconomicForms();
  }

  @Get('student/:studentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get socioeconomic form by student id' })
  @ApiParam({ name: 'studentId', format: 'uuid' })
  @ApiOkResponse({ description: 'Socioeconomic form returned successfully' })
  @ApiNotFoundResponse({ description: 'Socioeconomic form not found' })
  getSocioeconomicFormByStudentId(
    @Param('studentId', new ParseUUIDPipe()) studentId: string,
  ): Promise<SocioeconomicForm> {
    return this.socioeconomicFormService.getSocioeconomicFormByStudentId(
      studentId,
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get socioeconomic form by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Socioeconomic form returned successfully' })
  @ApiNotFoundResponse({ description: 'Socioeconomic form not found' })
  getSocioeconomicFormById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<SocioeconomicForm> {
    return this.socioeconomicFormService.getSocioeconomicFormById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update socioeconomic form by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ type: UpdateSocioeconomicFormDto })
  @ApiOkResponse({ description: 'Socioeconomic form updated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request payload or id' })
  @ApiNotFoundResponse({ description: 'Socioeconomic form not found' })
  updateSocioeconomicForm(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateDto: UpdateSocioeconomicFormDto,
  ): Promise<SocioeconomicForm> {
    return this.socioeconomicFormService.updateSocioeconomicForm(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete socioeconomic form by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Socioeconomic form deleted successfully' })
  @ApiNotFoundResponse({ description: 'Socioeconomic form not found' })
  async deleteSocioeconomicForm(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    await this.socioeconomicFormService.deleteSocioeconomicForm(id);
  }
}

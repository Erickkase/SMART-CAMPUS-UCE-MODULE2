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
import { ScholarshipService } from '../../application/services/scholarship.service';
import { CreateScholarshipDto } from '../../application/dtos/create-scholarship.dto';
import { UpdateScholarshipDto } from '../../application/dtos/update-scholarship.dto';
import { UpdateScholarshipStatusDto } from '../../application/dtos/update-scholarship-status.dto';
import { Scholarship } from '../../domain/entities/scholarship.entity';

@ApiTags('Scholarships')
@Controller('scholarships')
export class ScholarshipController {
  constructor(private readonly scholarshipService: ScholarshipService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create scholarship request' })
  @ApiBody({ type: CreateScholarshipDto })
  @ApiCreatedResponse({
    description: 'Scholarship created successfully',
    schema: {
      example: {
        id: '38b11c67-604a-4f1d-88f5-f7a7f06fce8e',
        studentId: '2f6f25c5-5df3-45e7-8f6f-3396a3ac4cf5',
        scholarshipType: 'ECONOMIC_SUPPORT',
        reason: 'Financial hardship due to family situation',
        status: 'PENDING',
        createdAt: '2026-06-01T12:00:00.000Z',
        updatedAt: '2026-06-01T12:00:00.000Z',
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid request payload' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  createScholarship(
    @Body() createScholarshipDto: CreateScholarshipDto,
  ): Promise<Scholarship> {
    return this.scholarshipService.createScholarship(createScholarshipDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List scholarship requests' })
  @ApiOkResponse({
    description: 'Scholarship list returned successfully',
    schema: {
      example: [
        {
          id: '38b11c67-604a-4f1d-88f5-f7a7f06fce8e',
          studentId: '2f6f25c5-5df3-45e7-8f6f-3396a3ac4cf5',
          scholarshipType: 'ECONOMIC_SUPPORT',
          reason: 'Financial hardship due to family situation',
          status: 'PENDING',
          createdAt: '2026-06-01T12:00:00.000Z',
          updatedAt: '2026-06-01T12:00:00.000Z',
        },
      ],
    },
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getScholarships(): Promise<Scholarship[]> {
    return this.scholarshipService.getScholarships();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get scholarship request by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({
    description: 'Scholarship returned successfully',
    schema: {
      example: {
        id: '38b11c67-604a-4f1d-88f5-f7a7f06fce8e',
        studentId: '2f6f25c5-5df3-45e7-8f6f-3396a3ac4cf5',
        scholarshipType: 'ECONOMIC_SUPPORT',
        reason: 'Financial hardship due to family situation',
        status: 'UNDER_REVIEW',
        createdAt: '2026-06-01T12:00:00.000Z',
        updatedAt: '2026-06-01T15:00:00.000Z',
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid scholarship id' })
  @ApiNotFoundResponse({ description: 'Scholarship not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getScholarshipById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Scholarship> {
    return this.scholarshipService.getScholarshipById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update scholarship request fields' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ type: UpdateScholarshipDto })
  @ApiOkResponse({ description: 'Scholarship updated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request payload or id' })
  @ApiNotFoundResponse({ description: 'Scholarship not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  updateScholarship(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateScholarshipDto: UpdateScholarshipDto,
  ): Promise<Scholarship> {
    return this.scholarshipService.updateScholarship(id, updateScholarshipDto);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update scholarship request status' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ type: UpdateScholarshipStatusDto })
  @ApiOkResponse({ description: 'Scholarship status updated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid status transition or id' })
  @ApiNotFoundResponse({ description: 'Scholarship not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  updateScholarshipStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateScholarshipStatusDto: UpdateScholarshipStatusDto,
  ): Promise<Scholarship> {
    return this.scholarshipService.updateScholarshipStatus(
      id,
      updateScholarshipStatusDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete scholarship request by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Scholarship deleted successfully' })
  @ApiBadRequestResponse({ description: 'Invalid scholarship id' })
  @ApiNotFoundResponse({ description: 'Scholarship not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async deleteScholarship(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    await this.scholarshipService.deleteScholarship(id);
  }
}

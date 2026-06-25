import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { CreateSubjectDto } from './create-subject.dto';

export class UpdateSubjectDto extends PartialType(CreateSubjectDto) {
  @ApiPropertyOptional({ description: 'Unique subject code', example: 'CS-102' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  code?: string;

  @ApiPropertyOptional({ description: 'Subject name', example: 'Programming Fundamentals' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({ description: 'Academic credits', example: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  credits?: number;

  @ApiPropertyOptional({ description: 'Academic level', example: 2 })
  @IsOptional()
  @IsInt()
  @Min(1)
  academicLevel?: number;

  @ApiPropertyOptional({ description: 'Active subject flag', example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

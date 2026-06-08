import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { CreateSocioeconomicFormDto } from './create-socioeconomic-form.dto';

export class UpdateSocioeconomicFormDto extends PartialType(
  CreateSocioeconomicFormDto,
) {
  @ApiPropertyOptional({ example: 650 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  familyIncome?: number;

  @ApiPropertyOptional({ example: 'OWNED' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  housingType?: string;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  familyMembers?: number;

  @ApiPropertyOptional({ example: 'PART_TIME' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  employmentStatus?: string;

  @ApiPropertyOptional({ example: 'Disability condition in household' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  vulnerabilityFactors?: string;

  @ApiPropertyOptional({ example: 'Updated socioeconomic observations' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  observations?: string;
}

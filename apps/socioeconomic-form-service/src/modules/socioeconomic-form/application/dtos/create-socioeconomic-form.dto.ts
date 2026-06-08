import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class CreateSocioeconomicFormDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  studentId!: string;

  @ApiProperty({ example: 550.5 })
  @IsNumber()
  @Min(0)
  familyIncome!: number;

  @ApiProperty({ example: 'RENTED' })
  @IsString()
  @IsNotEmpty()
  housingType!: string;

  @ApiProperty({ example: 4 })
  @IsNumber()
  @Min(1)
  familyMembers!: number;

  @ApiProperty({ example: 'UNEMPLOYED' })
  @IsString()
  @IsNotEmpty()
  employmentStatus!: string;

  @ApiProperty({ example: 'Single-parent household' })
  @IsString()
  @IsNotEmpty()
  vulnerabilityFactors!: string;

  @ApiProperty({ example: 'Student requires socioeconomic support evaluation' })
  @IsString()
  @IsNotEmpty()
  observations!: string;
}

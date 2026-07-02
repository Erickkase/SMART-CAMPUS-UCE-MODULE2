import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({ description: 'National or institutional identifier', example: '1750000001' })
  @IsString()
  @IsNotEmpty()
  identification!: string;

  @ApiProperty({ description: 'Student first name', example: 'Ana' })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({ description: 'Student last name', example: 'Perez' })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({ description: 'Student email address', example: 'ana.perez@uce.edu.ec' })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: 'Academic program name', example: 'Computer Science' })
  @IsString()
  @IsNotEmpty()
  academicProgram!: string;

  @ApiProperty({ description: 'Indicates if the student is active', example: true })
  @IsBoolean()
  isActive!: boolean;
}

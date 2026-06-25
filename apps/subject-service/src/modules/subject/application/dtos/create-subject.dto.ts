import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateSubjectDto {
  @ApiProperty({
    description: 'Unique subject code',
    example: 'CS-101',
  })
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiProperty({
    description: 'Subject name',
    example: 'Introduction to Computer Science',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'Academic credits assigned to the subject',
    example: 4,
  })
  @IsInt()
  @Min(1)
  credits!: number;

  @ApiProperty({
    description: 'Academic level where the subject belongs',
    example: 1,
  })
  @IsInt()
  @Min(1)
  academicLevel!: number;

  @ApiProperty({
    description: 'Indicates if the subject is active in the curriculum',
    example: true,
  })
  @IsBoolean()
  isActive!: boolean;
}

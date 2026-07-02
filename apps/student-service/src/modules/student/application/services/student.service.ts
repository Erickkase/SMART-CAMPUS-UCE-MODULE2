import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateStudentDto } from '../dtos/create-student.dto';
import { UpdateStudentDto } from '../dtos/update-student.dto';
import { Student } from '../../domain/entities/student.entity';
import {
  STUDENT_REPOSITORY,
  StudentRepository,
  UpdateStudentData,
} from '../../domain/repositories/student.repository';

@Injectable()
export class StudentService {
  constructor(
    @Inject(STUDENT_REPOSITORY)
    private readonly studentRepository: StudentRepository,
  ) {}

  async createStudent(createStudentDto: CreateStudentDto): Promise<Student> {
    const now = new Date();
    const student = new Student(
      randomUUID(),
      createStudentDto.identification,
      createStudentDto.firstName,
      createStudentDto.lastName,
      createStudentDto.email,
      createStudentDto.academicProgram,
      createStudentDto.isActive,
      now,
      now,
    );

    return this.studentRepository.create(student);
  }

  async getStudents(): Promise<Student[]> {
    return this.studentRepository.findAll();
  }

  async getStudentById(id: string): Promise<Student> {
    const student = await this.studentRepository.findById(id);

    if (!student) {
      throw new NotFoundException(`Student with id ${id} was not found`);
    }

    return student;
  }

  async updateStudent(id: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
    await this.getStudentById(id);

    const updateData: UpdateStudentData = {
      identification: updateStudentDto.identification,
      firstName: updateStudentDto.firstName,
      lastName: updateStudentDto.lastName,
      email: updateStudentDto.email,
      academicProgram: updateStudentDto.academicProgram,
      isActive: updateStudentDto.isActive,
    };

    const updatedStudent = await this.studentRepository.update(id, updateData);

    if (!updatedStudent) {
      throw new NotFoundException(`Student with id ${id} was not found`);
    }

    return updatedStudent;
  }

  async deleteStudent(id: string): Promise<void> {
    await this.getStudentById(id);

    const deleted = await this.studentRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Student with id ${id} was not found`);
    }
  }
}

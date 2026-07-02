import { Injectable } from '@nestjs/common';
import { Student } from '../../../../domain/entities/student.entity';
import {
  StudentRepository,
  UpdateStudentData,
} from '../../../../domain/repositories/student.repository';

@Injectable()
export class StudentInMemoryRepository implements StudentRepository {
  private readonly students = new Map<string, Student>();

  async create(student: Student): Promise<Student> {
    this.students.set(student.id, student);
    return student;
  }

  async findAll(): Promise<Student[]> {
    return Array.from(this.students.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  async findById(id: string): Promise<Student | null> {
    return this.students.get(id) ?? null;
  }

  async update(id: string, data: UpdateStudentData): Promise<Student | null> {
    const existing = this.students.get(id);
    if (!existing) {
      return null;
    }

    if (data.identification !== undefined) existing.identification = data.identification;
    if (data.firstName !== undefined) existing.firstName = data.firstName;
    if (data.lastName !== undefined) existing.lastName = data.lastName;
    if (data.email !== undefined) existing.email = data.email;
    if (data.academicProgram !== undefined) existing.academicProgram = data.academicProgram;
    if (data.isActive !== undefined) existing.isActive = data.isActive;
    existing.updatedAt = new Date();

    this.students.set(id, existing);
    return existing;
  }

  async delete(id: string): Promise<boolean> {
    return this.students.delete(id);
  }
}

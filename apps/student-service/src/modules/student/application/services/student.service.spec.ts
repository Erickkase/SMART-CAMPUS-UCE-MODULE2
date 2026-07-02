import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Student } from '../../domain/entities/student.entity';
import {
  STUDENT_REPOSITORY,
  StudentRepository,
} from '../../domain/repositories/student.repository';
import { StudentService } from './student.service';

describe('StudentService', () => {
  let service: StudentService;
  let repository: jest.Mocked<StudentRepository>;

  const student = new Student(
    '2f6f25c5-5df3-45e7-8f6f-3396a3ac4cf5',
    '1750000001',
    'Ana',
    'Perez',
    'ana.perez@uce.edu.ec',
    'Computer Science',
    true,
    new Date('2026-06-01T12:00:00.000Z'),
    new Date('2026-06-01T12:00:00.000Z'),
  );

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        {
          provide: STUDENT_REPOSITORY,
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<StudentService>(StudentService);
  });

  it('should create a student', async () => {
    repository.create.mockImplementation(async (createdStudent: Student) => createdStudent);

    const result = await service.createStudent({
      identification: student.identification,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      academicProgram: student.academicProgram,
      isActive: student.isActive,
    });

    expect(result.email).toBe(student.email);
    expect(repository.create).toHaveBeenCalledTimes(1);
  });

  it('should return all students', async () => {
    repository.findAll.mockResolvedValue([student]);

    await expect(service.getStudents()).resolves.toEqual([student]);
    expect(repository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should throw NotFoundException when student does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.getStudentById(student.id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('should update a student', async () => {
    const updatedStudent = new Student(
      student.id,
      student.identification,
      'Ana Maria',
      student.lastName,
      student.email,
      student.academicProgram,
      student.isActive,
      student.createdAt,
      new Date('2026-06-01T13:00:00.000Z'),
    );

    repository.findById.mockResolvedValue(student);
    repository.update.mockResolvedValue(updatedStudent);

    const result = await service.updateStudent(student.id, { firstName: 'Ana Maria' });

    expect(result.firstName).toBe('Ana Maria');
    expect(repository.update).toHaveBeenCalledWith(student.id, {
      identification: undefined,
      firstName: 'Ana Maria',
      lastName: undefined,
      email: undefined,
      academicProgram: undefined,
      isActive: undefined,
    });
  });

  it('should delete a student', async () => {
    repository.findById.mockResolvedValue(student);
    repository.delete.mockResolvedValue(true);

    await expect(service.deleteStudent(student.id)).resolves.toBeUndefined();
    expect(repository.delete).toHaveBeenCalledWith(student.id);
  });
});

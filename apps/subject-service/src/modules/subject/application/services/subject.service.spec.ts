import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Subject } from '../../domain/entities/subject.entity';
import {
  SUBJECT_REPOSITORY,
  SubjectRepository,
} from '../../domain/repositories/subject.repository';
import { SubjectService } from './subject.service';

describe('SubjectService', () => {
  let service: SubjectService;
  let repository: jest.Mocked<SubjectRepository>;

  const subject = new Subject(
    '86a8aa07-b63d-4b1d-9f87-62be9f6d4182',
    'CS-101',
    'Introduction to Computer Science',
    4,
    1,
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
        SubjectService,
        {
          provide: SUBJECT_REPOSITORY,
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<SubjectService>(SubjectService);
  });

  it('should create a subject', async () => {
    repository.create.mockImplementation(async (createdSubject: Subject) => createdSubject);

    const result = await service.createSubject({
      code: subject.code,
      name: subject.name,
      credits: subject.credits,
      academicLevel: subject.academicLevel,
      isActive: subject.isActive,
    });

    expect(result.code).toBe(subject.code);
    expect(repository.create).toHaveBeenCalledTimes(1);
  });

  it('should return all subjects', async () => {
    repository.findAll.mockResolvedValue([subject]);

    await expect(service.getSubjects()).resolves.toEqual([subject]);
    expect(repository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should throw NotFoundException when subject does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.getSubjectById(subject.id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('should update a subject', async () => {
    const updatedSubject = new Subject(
      subject.id,
      subject.code,
      'Programming Fundamentals',
      subject.credits,
      subject.academicLevel,
      subject.isActive,
      subject.createdAt,
      new Date('2026-06-01T13:00:00.000Z'),
    );

    repository.findById.mockResolvedValue(subject);
    repository.update.mockResolvedValue(updatedSubject);

    const result = await service.updateSubject(subject.id, {
      name: 'Programming Fundamentals',
    });

    expect(result.name).toBe('Programming Fundamentals');
    expect(repository.update).toHaveBeenCalledWith(subject.id, {
      code: undefined,
      name: 'Programming Fundamentals',
      credits: undefined,
      academicLevel: undefined,
      isActive: undefined,
    });
  });

  it('should delete a subject', async () => {
    repository.findById.mockResolvedValue(subject);
    repository.delete.mockResolvedValue(true);

    await expect(service.deleteSubject(subject.id)).resolves.toBeUndefined();
    expect(repository.delete).toHaveBeenCalledWith(subject.id);
  });
});

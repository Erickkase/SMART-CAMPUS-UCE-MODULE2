import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SocioeconomicForm } from '../../domain/entities/socioeconomic-form.entity';
import {
  SOCIOECONOMIC_FORM_REPOSITORY,
  SocioeconomicFormRepository,
} from '../../domain/repositories/socioeconomic-form.repository';
import { SocioeconomicFormService } from './socioeconomic-form.service';

describe('SocioeconomicFormService', () => {
  let service: SocioeconomicFormService;
  let repository: jest.Mocked<SocioeconomicFormRepository>;

  const form = new SocioeconomicForm(
    '67e95da2-65f7-4de7-8dc0-622b7298236b',
    '2f6f25c5-5df3-45e7-8f6f-3396a3ac4cf5',
    550,
    'RENTED',
    4,
    'UNEMPLOYED',
    'Single-parent household',
    'Student requires support evaluation',
    new Date('2026-06-01T12:00:00.000Z'),
    new Date('2026-06-01T12:00:00.000Z'),
  );

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByStudentId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SocioeconomicFormService,
        { provide: SOCIOECONOMIC_FORM_REPOSITORY, useValue: repository },
      ],
    }).compile();

    service = module.get<SocioeconomicFormService>(SocioeconomicFormService);
  });

  it('should create a socioeconomic form', async () => {
    repository.create.mockImplementation(
      async (createdForm: SocioeconomicForm) => createdForm,
    );

    const result = await service.createSocioeconomicForm({
      studentId: form.studentId,
      familyIncome: form.familyIncome,
      housingType: form.housingType,
      familyMembers: form.familyMembers,
      employmentStatus: form.employmentStatus,
      vulnerabilityFactors: form.vulnerabilityFactors,
      observations: form.observations,
    });

    expect(result.studentId).toBe(form.studentId);
    expect(repository.create).toHaveBeenCalledTimes(1);
  });

  it('should return all socioeconomic forms', async () => {
    repository.findAll.mockResolvedValue([form]);

    await expect(service.getSocioeconomicForms()).resolves.toEqual([form]);
  });

  it('should throw NotFoundException when form does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.getSocioeconomicFormById(form.id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('should update an existing socioeconomic form', async () => {
    const updatedForm = new SocioeconomicForm(
      form.id,
      form.studentId,
      700,
      form.housingType,
      form.familyMembers,
      form.employmentStatus,
      form.vulnerabilityFactors,
      form.observations,
      form.createdAt,
      new Date('2026-06-01T13:00:00.000Z'),
    );

    repository.findById.mockResolvedValue(form);
    repository.update.mockResolvedValue(updatedForm);

    const result = await service.updateSocioeconomicForm(form.id, {
      familyIncome: 700,
    });

    expect(result.familyIncome).toBe(700);
  });
});

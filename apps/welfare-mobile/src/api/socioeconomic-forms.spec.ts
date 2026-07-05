import { welfareApi } from './welfare-client';
import {
  createSocioeconomicFormRequest,
  getSocioeconomicFormByStudent,
  getSocioeconomicFormDetail,
  getSocioeconomicFormsList,
  removeSocioeconomicForm,
  updateSocioeconomicFormRequest,
} from './socioeconomic-forms';

jest.mock('./welfare-client', () => ({
  welfareApi: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    interceptors: { request: { use: jest.fn() } },
  },
}));

const mockForm = {
  id: 'form-1',
  studentId: '00000000-0000-0000-0000-000000000001',
  familyIncome: 12000,
  housingType: 'RENTED',
  familyMembers: 4,
  employmentStatus: 'EMPLOYED',
  vulnerabilityFactors: 'None',
  observations: 'Needs support',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('socioeconomic forms API wrappers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches the form list', async () => {
    (welfareApi.get as jest.Mock).mockResolvedValue({ data: [mockForm] });

    const result = await getSocioeconomicFormsList();

    expect(result).toEqual([mockForm]);
    expect(welfareApi.get).toHaveBeenCalledWith('/socioeconomic-forms');
  });

  it('fetches a form by id', async () => {
    (welfareApi.get as jest.Mock).mockResolvedValue({ data: mockForm });

    const result = await getSocioeconomicFormDetail('form-1');

    expect(result).toEqual(mockForm);
    expect(welfareApi.get).toHaveBeenCalledWith('/socioeconomic-forms/form-1');
  });

  it('fetches a form by student id', async () => {
    (welfareApi.get as jest.Mock).mockResolvedValue({ data: mockForm });

    const result = await getSocioeconomicFormByStudent(
      '00000000-0000-0000-0000-000000000001',
    );

    expect(result).toEqual(mockForm);
    expect(welfareApi.get).toHaveBeenCalledWith(
      '/socioeconomic-forms/student/00000000-0000-0000-0000-000000000001',
    );
  });

  it('creates a socioeconomic form', async () => {
    (welfareApi.post as jest.Mock).mockResolvedValue({ data: mockForm });
    const payload = {
      studentId: '00000000-0000-0000-0000-000000000001',
      familyIncome: 12000,
      housingType: 'RENTED',
      familyMembers: 4,
      employmentStatus: 'EMPLOYED',
      vulnerabilityFactors: 'None',
      observations: 'Needs support',
    };

    const result = await createSocioeconomicFormRequest(payload);

    expect(result).toEqual(mockForm);
    expect(welfareApi.post).toHaveBeenCalledWith('/socioeconomic-forms', payload);
  });

  it('updates a socioeconomic form', async () => {
    const updated = { ...mockForm, familyIncome: 15000 };
    (welfareApi.patch as jest.Mock).mockResolvedValue({ data: updated });
    const payload = { familyIncome: 15000 };

    const result = await updateSocioeconomicFormRequest('form-1', payload);

    expect(result).toEqual(updated);
    expect(welfareApi.patch).toHaveBeenCalledWith(
      '/socioeconomic-forms/form-1',
      payload,
    );
  });

  it('deletes a socioeconomic form', async () => {
    (welfareApi.delete as jest.Mock).mockResolvedValue({});

    await removeSocioeconomicForm('form-1');

    expect(welfareApi.delete).toHaveBeenCalledWith('/socioeconomic-forms/form-1');
  });
});

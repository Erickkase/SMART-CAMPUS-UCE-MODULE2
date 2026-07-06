import { welfareApi } from './welfare-client';
import {
  changeScholarshipStatus,
  createScholarshipRequest,
  getScholarshipDetail,
  getScholarshipsList,
  removeScholarship,
} from './scholarships';

jest.mock('./welfare-client', () => ({
  welfareApi: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    interceptors: { request: { use: jest.fn() } },
  },
}));

const mockScholarship = {
  id: 'scholarship-1',
  studentId: '00000000-0000-0000-0000-000000000001',
  scholarshipType: 'ECONOMIC_SUPPORT',
  reason: 'Financial need',
  status: 'PENDING',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('scholarships API wrappers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches the scholarship list', async () => {
    (welfareApi.get as jest.Mock).mockResolvedValue({ data: [mockScholarship] });

    const result = await getScholarshipsList();

    expect(result).toEqual([mockScholarship]);
    expect(welfareApi.get).toHaveBeenCalledWith('/scholarships');
  });

  it('fetches a single scholarship by id', async () => {
    (welfareApi.get as jest.Mock).mockResolvedValue({ data: mockScholarship });

    const result = await getScholarshipDetail('scholarship-1');

    expect(result).toEqual(mockScholarship);
    expect(welfareApi.get).toHaveBeenCalledWith('/scholarships/scholarship-1');
  });

  it('creates a scholarship request', async () => {
    (welfareApi.post as jest.Mock).mockResolvedValue({ data: mockScholarship });
    const payload = {
      studentId: '00000000-0000-0000-0000-000000000001',
      scholarshipType: 'ECONOMIC_SUPPORT',
      reason: 'Financial need',
      status: 'PENDING' as const,
    };

    const result = await createScholarshipRequest(payload);

    expect(result).toEqual(mockScholarship);
    expect(welfareApi.post).toHaveBeenCalledWith('/scholarships', payload);
  });

  it('updates scholarship status', async () => {
    const updated = { ...mockScholarship, status: 'APPROVED' };
    (welfareApi.patch as jest.Mock).mockResolvedValue({ data: updated });

    const result = await changeScholarshipStatus('scholarship-1', 'APPROVED');

    expect(result).toEqual(updated);
    expect(welfareApi.patch).toHaveBeenCalledWith(
      '/scholarships/scholarship-1/status',
      { status: 'APPROVED' },
    );
  });

  it('deletes a scholarship', async () => {
    (welfareApi.delete as jest.Mock).mockResolvedValue({});

    await removeScholarship('scholarship-1');

    expect(welfareApi.delete).toHaveBeenCalledWith('/scholarships/scholarship-1');
  });
});

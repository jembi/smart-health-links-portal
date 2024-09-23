import { UserModel } from '@/domain/models/user';
import { IServerConfigRepository } from '@/infrastructure/repositories/interfaces/server-config-repository';
import {
  ExternalDataFetchError,
  HapiFhirService,
} from '@/services/hapi-fhir.service';

import { getPatientDataUseCase } from './get-patient-data';
import { IUserRepository } from '@/infrastructure/repositories/interfaces/user-repository';

// Mock the HapiFhirService and ExternalDataFetchError
jest.mock('@/services/hapi-fhir.service', () => ({
  HapiFhirService: jest.fn(),
  ExternalDataFetchError: jest.requireActual('@/services/hapi-fhir.service')
    .ExternalDataFetchError,
}));

describe('getPatientDataUseCase', () => {
  let mockRepo: jest.Mocked<IServerConfigRepository>;
  let mockUserRepo: jest.Mocked<IUserRepository>;
  let mockUser: jest.Mocked<UserModel>;
  let mockHapiFhirService: jest.Mocked<HapiFhirService>;

  beforeEach(() => {
    mockRepo = {
      findMany: jest.fn(),
    } as any;

    mockUser = {
      getPatientId: jest.fn().mockReturnValue('test-patient-id'),
      getServerConfigId: jest.fn().mockReturnValue('server-config-id'),
    } as any;

    mockHapiFhirService = {
      getPatientData: jest.fn(),
    } as any;

    (HapiFhirService as jest.Mock).mockImplementation(
      () => mockHapiFhirService,
    );
  });

  it('should throw ExternalDataFetchError if no server config is found', async () => {
    mockRepo.findMany.mockResolvedValue([]); // No server config

    await expect(
      getPatientDataUseCase(
        { repo: mockRepo, userRepo: mockUserRepo },
        { user: mockUser },
      ),
    ).rejects.toThrow(new ExternalDataFetchError('Missing Config error.'));
  });

  it('should throw ExternalDataFetchError if service fails to fetch data', async () => {
    mockRepo.findMany.mockResolvedValue([
      { endpoint_url: 'http://test-url.com' },
    ]);
    mockHapiFhirService.getPatientData.mockRejectedValue(
      new Error('Service error'),
    );

    await expect(
      getPatientDataUseCase(
        { repo: mockRepo, userRepo: mockUserRepo },
        { user: mockUser },
      ),
    ).rejects.toThrow(new ExternalDataFetchError('Unfullfilled request'));
  });

  it('should throw ExternalDataFetchError if service returns no data', async () => {
    mockRepo.findMany.mockResolvedValue([
      { endpoint_url: 'http://test-url.com' },
    ]);
    mockHapiFhirService.getPatientData.mockResolvedValue(null);

    await expect(
      getPatientDataUseCase(
        { repo: mockRepo, userRepo: mockUserRepo },
        { user: mockUser },
      ),
    ).rejects.toThrow(new ExternalDataFetchError('Unfullfilled request'));
  });

  it('should return patient data if service fetches data successfully', async () => {
    const mockPatientData = { id: 'test-patient-id', name: 'John Doe' };

    mockRepo.findMany.mockResolvedValue([
      { endpoint_url: 'http://test-url.com', id: 'server-config-id' },
    ]);
    mockHapiFhirService.getPatientData.mockResolvedValue(mockPatientData);

    const result = await getPatientDataUseCase(
      { repo: mockRepo, userRepo: mockUserRepo },
      { user: mockUser },
    );

    expect(mockHapiFhirService.getPatientData).toHaveBeenCalledWith(
      'test-patient-id',
      {},
    );
    expect(result).toBe(mockPatientData);
  });

  it('should handle errors gracefully', async () => {
    const error = new Error('Test error');
    mockRepo.findMany.mockResolvedValue([
      { endpoint_url: 'http://test-url.com', id: 'server-config-id' },
    ]);
    mockHapiFhirService.getPatientData.mockRejectedValue(error);

    await expect(
      getPatientDataUseCase(
        { repo: mockRepo, userRepo: mockUserRepo },
        { user: mockUser },
      ),
    ).rejects.toThrow(new ExternalDataFetchError('Unfullfilled request'));

    expect(mockHapiFhirService.getPatientData).toHaveBeenCalledWith(
      'test-patient-id',
      {},
    );
  });
});

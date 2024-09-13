import { IServerConfigRepository } from '@/infrastructure/repositories/interfaces/server-config-repository';
import { HapiFhirServiceFactory } from '@/services/hapi-fhir-factory';
import {
  IHapiFhirService,
  FhirSearchResult,
  FhirPatient,
} from '@/services/hapi-fhir.interface';
import { ExternalDataFetchError } from '@/services/hapi-fhir.service';

import { searchPatientUseCase } from './search-patient';

// Mock the HapiFhirServiceFactory and IServerConfigRepository
jest.mock('@/services/hapi-fhir-factory');
jest.mock('@/infrastructure/repositories/interfaces/server-config-repository');

describe('searchPatientUseCase', () => {
  let mockRepo: jest.Mocked<IServerConfigRepository>;
  let mockService: jest.Mocked<IHapiFhirService>;

  beforeEach(() => {
    mockRepo = {
      findMany: jest.fn(),
    } as any;

    mockService = {
      searchPatient: jest.fn(),
    } as any;

    HapiFhirServiceFactory.getService = jest.fn().mockReturnValue(mockService);
  });

  it('should return patient ID if patient data is found', async () => {
    const patientId = '12345';
    const expectedId = 'patient-12345';

    // Mock service configuration
    mockRepo.findMany.mockResolvedValue([{ endpoint_url: 'http://test.com' }]);

    // Mock patient search result
    mockService.searchPatient.mockResolvedValue({
      entry: [{ resource: { id: expectedId } }],
    } as FhirSearchResult<FhirPatient>);

    const result = await searchPatientUseCase(
      { repo: mockRepo },
      { patientId },
    );

    expect(result).toBe(expectedId);
    expect(mockService.searchPatient).toHaveBeenCalledWith(patientId);
  });

  it('should throw an error if configuration is missing', async () => {
    mockRepo.findMany.mockResolvedValue([]);

    await expect(
      searchPatientUseCase({ repo: mockRepo }, { patientId: '12345' }),
    ).rejects.toThrow(new ExternalDataFetchError('Missing Config error.'));
  });

  it('should throw an error if patient data is not found', async () => {
    const patientId = '12345';

    // Mock service configuration
    mockRepo.findMany.mockResolvedValue([{ endpoint_url: 'http://test.com' }]);

    // Mock empty patient search result
    mockService.searchPatient.mockResolvedValue({
      entry: [],
    } as FhirSearchResult<FhirPatient>);

    await expect(
      searchPatientUseCase({ repo: mockRepo }, { patientId }),
    ).rejects.toThrow(
      new ExternalDataFetchError('Patient Data not found.', 404),
    );
  });
});

import { getPatientDataUseCase } from "./get-patient-data";
import { IServerConfigRepository } from "@/infrastructure/repositories/interfaces/server-config-repository";
import { ExternalDataFetchError, HapiFhirService } from "@/services/hapi-fhir.service";
import { UserModel } from "@/domain/models/user";

// Mock the HapiFhirService and ExternalDataFetchError
jest.mock('@/services/hapi-fhir.service', () => ({
  HapiFhirService: jest.fn(),
  ExternalDataFetchError: jest.requireActual('@/services/hapi-fhir.service').ExternalDataFetchError,
}));

describe('getPatientDataUseCase', () => {
  let mockRepo: jest.Mocked<IServerConfigRepository>;
  let mockUser: jest.Mocked<UserModel>;
  let mockHapiFhirService: jest.Mocked<HapiFhirService<any>>;

  beforeEach(() => {
    mockRepo = {
      findMany: jest.fn(),
    } as any;

    mockUser = {
      getPatientId: jest.fn().mockReturnValue('test-patient-id'),
    } as any;

    mockHapiFhirService = {
      getPatientData: jest.fn(),
    } as any;

    (HapiFhirService as jest.Mock).mockImplementation(() => mockHapiFhirService);
  });

  it('should throw ExternalDataFetchError if no server config is found', async () => {
    mockRepo.findMany.mockResolvedValue([]); // No server config

    await expect(getPatientDataUseCase({ repo: mockRepo }, { user: mockUser }))
      .rejects
      .toThrow(new ExternalDataFetchError('Missing Config error.'));
  });

  it('should throw ExternalDataFetchError if service fails to fetch data', async () => {
    mockRepo.findMany.mockResolvedValue([{ endpoint_url: 'http://test-url.com' }]);
    mockHapiFhirService.getPatientData.mockRejectedValue(new Error('Service error'));

    await expect(getPatientDataUseCase({ repo: mockRepo }, { user: mockUser }))
      .rejects
      .toThrow(new ExternalDataFetchError('Unfullfilled request'));
  });

  it('should throw ExternalDataFetchError if service returns no data', async () => {
    mockRepo.findMany.mockResolvedValue([{ endpoint_url: 'http://test-url.com' }]);
    mockHapiFhirService.getPatientData.mockResolvedValue(null);

    await expect(getPatientDataUseCase({ repo: mockRepo }, { user: mockUser }))
      .rejects
      .toThrow(new ExternalDataFetchError('Unfullfilled request'));
  });

  it('should return patient data if service fetches data successfully', async () => {
    const mockPatientData = { id: 'test-patient-id', name: 'John Doe' };

    mockRepo.findMany.mockResolvedValue([{ endpoint_url: 'http://test-url.com' }]);
    mockHapiFhirService.getPatientData.mockResolvedValue(mockPatientData);

    const result = await getPatientDataUseCase({ repo: mockRepo }, { user: mockUser });

    expect(mockHapiFhirService.getPatientData).toHaveBeenCalledWith('test-patient-id', {});
    expect(result).toBe(mockPatientData);
  });

  it('should handle errors gracefully', async () => {
    const error = new Error('Test error');
    mockRepo.findMany.mockResolvedValue([{ endpoint_url: 'http://test-url.com' }]);
    mockHapiFhirService.getPatientData.mockRejectedValue(error);

    await expect(getPatientDataUseCase({ repo: mockRepo }, { user: mockUser }))
      .rejects
      .toThrow(new ExternalDataFetchError('Unfullfilled request'));

    expect(mockHapiFhirService.getPatientData).toHaveBeenCalledWith('test-patient-id', {});
  });
});

/**
 * @jest-environment node
 */

import { POST } from './route';
import { NextRequest, NextResponse } from 'next/server';
import { handleApiValidationError } from '@/app/utils/error-handler';
import { getSingleSHLinkUseCase } from '@/usecases/shlinks/get-single-shlink';
import { addEndpointUseCase } from '@/usecases/shlink-endpoint/add-endpoint';
import { mapModelToDto as mapModelToDtoShlinkMapper } from '@/mappers/shlink-mapper';
import { mapDtoToModel, mapModelToDto as mapModelToDtoEndpoint } from '@/mappers/shlink-endpoint-mapper';
import { NOT_FOUND } from '@/app/constants/http-constants';
import { getServerConfigsUseCase } from '@/usecases/server-configs/get-server-configs';

// Mock dependencies
jest.mock('@/app/utils/error-handler');
jest.mock('@/usecases/shlinks/get-single-shlink');
jest.mock('@/usecases/shlink-endpoint/add-endpoint');
jest.mock('@/usecases/server-configs/get-server-configs');
jest.mock('@/mappers/shlink-mapper');
jest.mock('@/mappers/shlink-endpoint-mapper');

describe('POST /api/v1/shlinks/[id]/endpoint', () => {
  const mockShlinkId = 'shlink-12345';
  const mockServerConfigId = 'config-567890';
  const mockUrlPath = '/api/test';
  const mockEndpointId = 'endpoint-67890';
  const mockManagementToken = 'token-xyz12345';

  const mockRequestBody = {
    url_path: mockUrlPath,
    management_token: mockManagementToken,
  };

  const mockShlink = {
    id: mockShlinkId,
    userId: 'user-12345',
    passcodeFailuresRemaining: 3,
    active: true,
    managementToken: mockManagementToken,
    configPasscode: 'passcode-abcde',
    configExp: new Date('2024-01-01T00:00:00Z'),
  };

  const mockServerConfig = {
    getId: jest.fn().mockReturnValue('server-config-id'),
    getConfigKey: jest.fn().mockReturnValue('dto-config-key'),
    getEndpointUrl: jest.fn().mockReturnValue('dto-endpoint-url'),
    getClientSecret: jest.fn().mockReturnValue('dto-client-secret'),
    getClientId: jest.fn().mockReturnValue('dto-client-id'),
    getRefreshToken: jest.fn().mockReturnValue('dto-refresh-token'),
    getRefreshTime: jest.fn().mockReturnValue(undefined),
    getAccessTokenResponse: jest.fn().mockReturnValue(undefined),
    getTokenEndpoint: jest.fn().mockReturnValue('dto-endpoint-url'),
};

  const mockEndpointDto = {
    shlinkId: mockShlinkId,
    serverConfigId: mockServerConfigId,
    urlPath: mockUrlPath,
    id: mockEndpointId,
  };

  const mockEndpointModel = {
    ...mockEndpointDto,
    getId: jest.fn().mockReturnValue(mockEndpointId),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and the created endpoint DTO if the shlink exists', async () => {
    // Mock the use case and mappers
    (getSingleSHLinkUseCase as jest.Mock).mockResolvedValue(mockShlink);
    (mapModelToDtoShlinkMapper as jest.Mock).mockReturnValue(mockShlink);
    (mapDtoToModel as jest.Mock).mockReturnValue(mockEndpointModel);
    (addEndpointUseCase as jest.Mock).mockResolvedValue(mockEndpointModel);
    (mapModelToDtoEndpoint as jest.Mock).mockReturnValue(mockEndpointDto);
    (getServerConfigsUseCase as jest.Mock).mockResolvedValue([mockServerConfig]);

    const mockRequest = new NextRequest('http://localhost/api/v1/share-link/shlink-12345/endpoint', {
      method: 'POST',
      body: JSON.stringify(mockRequestBody),
    });

    const response = await POST(mockRequest, { params: { id: mockShlinkId } });

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json).toEqual(mockEndpointDto);
  });

  it('should return 404 if the shlink is not found', async () => {
    (getSingleSHLinkUseCase as jest.Mock).mockResolvedValue(null);

    const mockRequest = new NextRequest('http://localhost/api/v1/share-link/non-existing-id/endpoint', {
      method: 'POST',
      body: JSON.stringify(mockRequestBody),
    });

    const response = await POST(mockRequest, { params: { id: 'non-existing-id' } });

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(404);

    const json = await response.json();
    expect(json).toEqual({ message: NOT_FOUND });
  });

  it('should handle validation errors', async () => {
    const mockError = new Error('Validation Error');
    (getSingleSHLinkUseCase as jest.Mock).mockImplementation(() => {
      throw mockError;
    });
    (handleApiValidationError as jest.Mock).mockImplementation(() =>
      NextResponse.json({ message: 'Validation failed' }, { status: 400 })
    );

    const mockRequest = new NextRequest('http://localhost/api/v1/share-link/shlink-12345/endpoint', {
      method: 'POST',
      body: JSON.stringify(mockRequestBody),
    });

    const response = await POST(mockRequest, { params: { id: mockShlinkId } });

    expect(handleApiValidationError).toHaveBeenCalledWith(mockError);
    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(400);

    const json = await response.json();
    expect(json).toEqual({ message: 'Validation failed' });
  });
});

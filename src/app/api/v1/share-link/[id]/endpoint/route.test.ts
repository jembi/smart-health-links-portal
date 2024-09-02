/**
 * @jest-environment node
 */

import { POST } from './route';
import { NextResponse } from 'next/server';
import { handleApiValidationError } from '@/app/utils/error-handler';
import { getSingleSHLinkUseCase } from '@/usecases/shlinks/get-single-shlink';
import { addEndpointUseCase } from '@/usecases/shlink-endpoint/add-endpoint';
import { mapModelToDto as mapModelToDtoShlinkMapper } from '@/mappers/shlink-mapper';
import { mapDtoToModel, mapModelToDto as mapModelToDtoEndpoint } from '@/mappers/shlink-endpoint-mapper';
import { NOT_FOUND } from '@/app/constants/http-constants';

// Mock dependencies
jest.mock('@/app/utils/error-handler', () => ({
  handleApiValidationError: jest.fn(),
}));

jest.mock('@/usecases/shlinks/get-single-shlink', () => ({
  getSingleSHLinkUseCase: jest.fn(),
}));

jest.mock('@/usecases/shlink-endpoint/add-endpoint', () => ({
  addEndpointUseCase: jest.fn(),
}));

jest.mock('@/mappers/shlink-mapper', () => ({
  mapModelToDto: jest.fn(),
}));

jest.mock('@/mappers/shlink-endpoint-mapper', () => ({
  mapDtoToModel: jest.fn(),
  mapModelToDto: jest.fn(),
}));

describe('POST /api/v1/shlinks/[id]/endpoints', () => {
  const mockShlinkId = 'shlink-12345';
  const mockServerConfigId = 'config-56789';
  const mockUrlPath = '/api/test';
  const mockEndpointId = 'endpoint-67890';

  const mockRequestBody = {
    server_config_id: mockServerConfigId,
    url_path: mockUrlPath,
    id: mockEndpointId,
  };

  const mockShlink = {
    id: mockShlinkId,
    userId: 'user-12345',
    passcodeFailuresRemaining: 3,
    active: true,
    managementToken: 'token-xyz12345',
    configPasscode: 'passcode-abcde',
    configExp: new Date('2024-01-01T00:00:00Z'),
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

  it('should return 200 and the created endpoint DTO if the shlink exists', async () => {
    // Mock the use case and mappers
    (getSingleSHLinkUseCase as jest.Mock).mockResolvedValue(mockShlink);
    (mapModelToDtoShlinkMapper as jest.Mock).mockReturnValue(mockShlink);
    (mapDtoToModel as jest.Mock).mockReturnValue(mockEndpointModel);
    (addEndpointUseCase as jest.Mock).mockResolvedValue(mockEndpointModel);
    (mapModelToDtoEndpoint as jest.Mock).mockReturnValue(mockEndpointDto);

    const mockRequest = new Request('http://localhost/api/v1/shlinks/shlink-12345/endpoints', {
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

    const mockRequest = new Request('http://localhost/api/v1/shlinks/non-existing-id/endpoints', {
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
    (handleApiValidationError as jest.Mock).mockImplementation(() => NextResponse.json({ message: 'Validation failed' }, { status: 400 }));

    const mockRequest = new Request('http://localhost/api/v1/shlinks/shlink-12345/endpoints', {
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

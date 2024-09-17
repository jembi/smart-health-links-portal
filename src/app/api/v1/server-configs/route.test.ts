/**
 * @jest-environment node
 */

import { NextRequest, NextResponse } from 'next/server';

import { POST, GET } from '@/app/api/v1/server-configs/route';
import { validateUserRoles } from '@/app/utils/authentication';
import { handleApiValidationError } from '@/app/utils/error-handler';
import {
  CreateServerConfigDto,
  ServerConfigDto,
} from '@/domain/dtos/server-config';
import { mapDtoToModel, mapModelToDto } from '@/mappers/server-config-mapper';
import { addServerConfigUseCase } from '@/usecases/server-configs/add-server-config';
import { getServerConfigsUseCase } from '@/usecases/server-configs/get-server-configs';

jest.mock('@/app/utils/authentication', () => ({
  validateUserRoles: jest.fn(),
}));

jest.mock('@/usecases/server-configs/add-server-config', () => ({
  addServerConfigUseCase: jest.fn(),
}));

jest.mock('@/usecases/server-configs/get-server-configs', () => ({
  getServerConfigsUseCase: jest.fn(),
}));

jest.mock('@/mappers/server-config-mapper', () => ({
  mapDtoToModel: jest.fn(),
  mapModelToDto: jest.fn(),
}));

jest.mock('@/app/utils/error-handler', () => ({
  handleApiValidationError: jest.fn(),
}));

describe('POST /api/v1/server-configs', () => {
  const mockCreateServerConfigDto: CreateServerConfigDto = {
    endpointUrl: 'https://dto-endpoint-url.com',
  };

  const mockServerConfigModel = {
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

  const mockServerConfigDto: ServerConfigDto = {
    id: 'server-config-id',
    endpointUrl: 'https://dto-endpoint-url.com',
  };

  const mockRoute = '/api/v1/server-configs';

  const mockRequest = (body: any) =>
    new NextRequest('http://localhost/api/v1/server-configs', {
      method: 'POST',
      body: JSON.stringify(body),
    });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return server config DTO and status 201 when server config is successfully created', async () => {
    (mapDtoToModel as jest.Mock).mockReturnValue(mockServerConfigModel);
    (validateUserRoles as jest.Mock).mockResolvedValue(true);
    (addServerConfigUseCase as jest.Mock).mockResolvedValue(
      mockServerConfigModel,
    );
    (mapModelToDto as jest.Mock).mockReturnValue(mockServerConfigDto);

    const request = mockRequest(mockCreateServerConfigDto);
    const response = await POST(request);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(201);

    const json = await response.json();
    expect(json).toEqual(mockServerConfigDto);
  });

  it('should handle validation errors and return status 422', async () => {
    const error = new Error('Validation error');
    (addServerConfigUseCase as jest.Mock).mockRejectedValue(error);
    (validateUserRoles as jest.Mock).mockResolvedValue(true);
    (handleApiValidationError as jest.Mock).mockReturnValue(
      NextResponse.json({ message: 'Validation error' }, { status: 422 }),
    );

    const request = mockRequest(mockCreateServerConfigDto);
    const response = await POST(request);

    expect(handleApiValidationError).toHaveBeenCalled();
    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(422);

    const json = await response.json();
    expect(json).toEqual({ message: 'Validation error' });
  });

  it('should handle unexpected errors and return status 500', async () => {
    const error = new Error('Unexpected error');
    (addServerConfigUseCase as jest.Mock).mockRejectedValue(error);
    (handleApiValidationError as jest.Mock).mockReturnValue(
      NextResponse.json({ message: 'Unexpected error' }, { status: 500 }),
    );

    const request = mockRequest(mockCreateServerConfigDto);
    const response = await POST(request);

    expect(handleApiValidationError).toHaveBeenCalled();
    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(500);

    const json = await response.json();
    expect(json).toEqual({ message: 'Unexpected error' });
  });
});

describe('GET /api/v1/server-configs', () => {
  const mockServerConfigModel = {
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

  const mockServerConfigDto: ServerConfigDto = {
    id: 'server-config-id',
    endpointUrl: 'https://dto-endpoint-url.com',
  };

  const mockRequest = () =>
    new NextRequest('http://localhost/api/v1/server-configs', {
      method: 'GET',
    });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return server config DTOs and status 200 when server configs are found', async () => {
    (getServerConfigsUseCase as jest.Mock).mockResolvedValue([
      mockServerConfigModel,
    ]);
    (validateUserRoles as jest.Mock).mockResolvedValue(true);
    (mapModelToDto as jest.Mock).mockReturnValue(mockServerConfigDto);

    const request = mockRequest();
    const response = await GET(request);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json).toEqual([mockServerConfigDto]);
  });

  it('should return an empty collection of server config DTOs and status 200 when no server configs are found', async () => {
    (getServerConfigsUseCase as jest.Mock).mockResolvedValue([]);

    const request = mockRequest();
    const response = await GET(request);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json).toEqual([]);
  });
});

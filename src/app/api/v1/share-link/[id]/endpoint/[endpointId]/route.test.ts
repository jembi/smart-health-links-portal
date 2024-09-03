/**
 * @jest-environment node
 */

import { GET } from './route';
import { NextResponse } from 'next/server';
import { getEndpointUseCase } from '@/usecases/shlink-endpoint/get-endpoint';
import { mapModelToDto } from '@/mappers/shlink-endpoint-mapper';
import { NOT_FOUND } from '@/app/constants/http-constants';

// Mock dependencies
jest.mock('@/usecases/shlink-endpoint/get-endpoint', () => ({
  getEndpointUseCase: jest.fn(),
}));

jest.mock('@/mappers/shlink-endpoint-mapper', () => ({
  mapModelToDto: jest.fn(),
}));

describe('GET /api/v1/share-link/1/endpoints/[endpointId]', () => {
  const mockEndpointId = 'endpoint-12345';

  const mockResult = {
    id: 'endpoint-12345',
    name: 'Test Endpoint',
    url: 'https://example.com/endpoint',
    active: true,
  };

  const mockDto = {
    id: 'endpoint-12345',
    name: 'Test Endpoint',
    url: 'https://example.com/endpoint',
    active: true,
  };

  it('should return endpoint DTO and status 200 when endpoint is found', async () => {
    // Mock the use case and mapper
    (getEndpointUseCase as jest.Mock).mockResolvedValue(mockResult);
    (mapModelToDto as jest.Mock).mockReturnValue(mockDto);

    const mockRequest = new Request('http://localhost/api/v1/share-link/1/endpoint/endpoint-12345', { method: 'GET' });
    const response = await GET(mockRequest, { params: { endpointId: mockEndpointId } });

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json).toEqual(mockDto);
  });

  it('should return NOT_FOUND message and status 404 when endpoint is not found', async () => {
    (getEndpointUseCase as jest.Mock).mockResolvedValue(null);

    const mockRequest = new Request('http://localhost/api/v1/share-link/1/endpoint/non-existing-id', { method: 'GET' });
    const response = await GET(mockRequest, { params: { endpointId: 'non-existing-id' } });

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(404);

    const json = await response.json();
    expect(json).toEqual({ message: NOT_FOUND });
  });
});

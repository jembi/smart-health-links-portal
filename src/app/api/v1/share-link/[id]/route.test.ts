/**
 * @jest-environment node
 */

import { NextRequest, NextResponse } from 'next/server';
import { GET } from './route'; // Import your API route handler
import { getSingleSHLinkUseCase } from '@/usecases/shlinks/get-single-shlink';
import { mapEntityToModel, mapModelToDto } from '@/mappers/shlink-mapper';
import { NOT_FOUND } from '@/app/constants/http-constants';
import { SHLinkDto } from '@/domain/dtos/shlink';
import { SHLinkModel } from '@/domain/models/shlink';
import { SHLinkEntity } from '@/entities/shlink';

// Mocks
jest.mock('@/usecases/shlinks/get-single-shlink', () => ({
  getSingleSHLinkUseCase: jest.fn(),
}));

jest.mock('@/mappers/shlink-mapper', () => ({
  mapEntityToModel: jest.fn(),
  mapModelToDto: jest.fn(),
}));

describe("GET /api/v1/share-link/[id]", () => {

  const mockEntity: SHLinkEntity = {
    id: '1',
    user_id: 'user-123456',
    passcode_failures_remaining: 3,
    active: true,
    management_token: 'token-xyz12345',
    config_passcode: 'passcode-abcde',
    config_exp: new Date('2024-01-01T00:00:00Z'),
  };

  const mockModel = new SHLinkModel(
    mockEntity.user_id,
    mockEntity.passcode_failures_remaining,
    mockEntity.active,
    mockEntity.management_token,
    mockEntity.config_passcode,
    mockEntity.config_exp,
    mockEntity.id
  );

  const mockDto: SHLinkDto = {
    id: '1',
    userId: 'user-123456',
    passcodeFailuresRemaining: 3,
    active: true,
    managementToken: 'token-xyz12345',
    configPasscode: 'passcode-abcde',
    configExp: new Date('2024-01-01T00:00:00Z')
  };

  it("should return SHLink DTO and status 200 when link is found", async () => {
    // Mock implementations
    (getSingleSHLinkUseCase as jest.Mock).mockResolvedValue(mockEntity);
    (mapEntityToModel as jest.Mock).mockReturnValue(mockModel);
    (mapModelToDto as jest.Mock).mockReturnValue(mockDto);

    const mockRequest = new NextRequest('http://localhost/api/v1/share-link/1', { method: 'GET' });
    const response = await GET(mockRequest, { params: { id: '1' } });

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(200);

    const json = await response.json();
    json.configExp = new Date(json.configExp)
    expect(json).toEqual(mockDto);
  });

});

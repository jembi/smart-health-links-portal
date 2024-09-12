/**
 * @jest-environment node
 */

import { NextRequest, NextResponse } from 'next/server';

import { getUserProfile } from '@/app/utils/authentication';
import { mapModelToDto } from '@/mappers/shlink-mapper';
import { deactivateSHLinksUseCase } from '@/usecases/shlinks/deactivate-shlink';

import { DELETE } from './route';

jest.mock('@/usecases/shlinks/deactivate-shlink', () => ({
  deactivateSHLinksUseCase: jest.fn(),
}));

jest.mock('@/mappers/shlink-mapper', () => ({
  mapModelToDto: jest.fn(),
}));

jest.mock('@/app/utils/error-handler', () => ({
  handleApiValidationError: jest.fn(),
}));

jest.mock('@/app/utils/authentication', () => ({
  getUserProfile: jest.fn(),
}));

describe('DELETE /api/v1/share-link/[id]/deactivate', () => {
  const mockId: string = '1';

  const mockModel = {
    getId: jest.fn().mockReturnValue('1'),
    getUserId: jest.fn().mockReturnValue('user-123456'),
    getPasscodeFailuresRemaining: jest.fn().mockReturnValue(3),
    getActive: jest.fn().mockReturnValue(false),
    getManagementToken: jest.fn().mockReturnValue('token-xyzabcde'),
    getConfigPasscode: jest.fn().mockReturnValue('passcode-abcde'),
    getConfigExp: jest.fn().mockReturnValue(new Date('2024-01-01T00:00:00Z')),
  };

  const mockDto = {
    id: '1',
    userId: 'user-123456',
    passcodeFailuresRemaining: 3,
    active: false,
    managementToken: 'token-xyzabcde',
    configPasscode: 'passcode-abcde',
    configExp: '2024-01-01T00:00:00Z',
  };

  const mockResult = {
    id: '1',
    userId: 'user-123456',
    passcodeFailuresRemaining: 3,
    active: false,
    managementToken: 'token-xyzabcde',
    configPasscode: 'passcode-abcde',
    configExp: '2024-01-01T00:00:00Z',
  };

  const mockRequest = () =>
    new NextRequest('http://localhost/api/share-link/1/deactivate', {
      method: 'DELETE',
    });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return deactivated link DTO and status 200 when link is found', async () => {
    (getUserProfile as jest.Mock).mockResolvedValue({id: 'user-123456', name: '', email: ''});
    (deactivateSHLinksUseCase as jest.Mock).mockResolvedValue(mockModel);
    (mapModelToDto as jest.Mock).mockReturnValue(mockDto);

    const request = mockRequest();
    const response = await DELETE(request, {params: {id: 'user-123456',}});

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json).toEqual(mockResult);
  });
});

/**
 * @jest-environment node
 */

import { GET } from './route';
import { handleApiValidationError } from '@/app/utils/error-handler';
import { SHLinkDto } from '@/domain/dtos/shlink';
import { SHLinkModel } from '@/domain/models/shlink';
import { SHLinkEntity } from '@/entities/shlink';
import { getSHLinkUseCase } from '@/usecases/shlinks/get-shlink';
import { mapDtoToModel, mapEntityToModel, mapModelToDto } from '@/mappers/shlink-mapper';
import { NextRequest, NextResponse } from 'next/server';
import { NOT_FOUND } from '@/app/constants/http-constants';

// Mocks
jest.mock('@/app/utils/error-handler');
jest.mock('@/usecases/shlinks/get-shlink');
jest.mock('@/mappers/shlink-mapper');

// Constants
const mockId = '1';
const userId= 'user-12345'


const mockDto: SHLinkDto = {
    id: '1',
    userId: 'user-12345',
    passcodeFailuresRemaining: 3,
    active: true,
    managementToken: 'token-xyz12345',
    configPasscode: 'passcode-abcde',
    configExp: new Date('2024-01-01T00:00:00Z')
};

const mockModel = new SHLinkModel(
    mockDto.userId,
    mockDto.passcodeFailuresRemaining,
    mockDto.active,
    mockDto.managementToken,
    mockDto.configPasscode,
    mockDto.configExp,
    "1"
);

// Mocks for use cases and mappers
(getSHLinkUseCase as jest.Mock).mockResolvedValue(mockModel);
(mapModelToDto as jest.Mock).mockReturnValue(mockDto);
(mapEntityToModel as jest.Mock).mockReturnValue(mockModel);

describe('GET /api/v1/share-link', () => {
    it('should handle successful GET request when link is found', async () => {
        const request = new NextRequest('http://localhost/api/share-link/1', { method: 'GET' });

        const response = await GET(request, { params: { id: userId } });

        expect(response).toBeInstanceOf(NextResponse);
        expect(response.status).toBe(200);
        const responseBody = await response.json();
        responseBody.configExp = new Date(responseBody.configExp)
        expect(responseBody).toEqual(mockDto);
    });

    
});

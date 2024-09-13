/**
 * @jest-environment node
 */

import { NextRequest, NextResponse } from 'next/server';

import { GET } from '@/app/api/v1/users/[id]/route';
import { NOT_FOUND } from '@/app/constants/http-constants';
import { validateUser } from '@/app/utils/authentication';
import { handleApiValidationError } from '@/app/utils/error-handler';
import { mapModelToDto } from '@/mappers/user-mapper';
import { getUserUseCase } from '@/usecases/users/get-user';

jest.mock('@/usecases/users/get-user', () => ({
  getUserUseCase: jest.fn(),
}));

jest.mock('@/mappers/user-mapper', () => ({
  mapModelToDto: jest.fn(),
}));

jest.mock('@/app/utils/authentication', () => ({
  validateUser: jest.fn(),
}));

jest.mock('@/app/utils/error-handler', () => ({
  handleApiValidationError: jest.fn(),
}));

describe('GET /api/users/[id]', () => {
  const mockUser = {
    getId: jest.fn().mockReturnValue('user-id'),
    getUserId: jest.fn().mockReturnValue('user-user-id'),
    getPatientId: jest.fn().mockReturnValue('user-patient-id'),
  };

  const mockDto = {
    id: 'user-id',
    userId: 'user-user-id',
    patientId: 'user-patient-id',
  };

  const mockRoute = '/api/v1/users/{id}'

  it('should return user DTO and status 200 when user is found and validation passes', async () => {
    // Mock implementations
    (validateUser as jest.Mock).mockResolvedValue(undefined); 
    (getUserUseCase as jest.Mock).mockResolvedValue(mockUser);
    (mapModelToDto as jest.Mock).mockReturnValue(mockDto);

    const mockRequest = new NextRequest('http://localhost/api/users/user-id', {
      method: 'GET',
    });
    const response = await GET(mockRequest, { params: { id: 'user-id' } });

    expect(validateUser).toHaveBeenCalledWith(mockRequest, 'user-id');
    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json).toEqual(mockDto);
  });

  it('should return NOT_FOUND message and status 404 when user is not found', async () => {
    (validateUser as jest.Mock).mockResolvedValue(undefined);
    (getUserUseCase as jest.Mock).mockResolvedValue(null);

    const mockRequest = new NextRequest(
      'http://localhost/api/users/non-existing-id',
      { method: 'GET' },
    );
    const response = await GET(mockRequest, {
      params: { id: 'non-existing-id' },
    });

    expect(validateUser).toHaveBeenCalledWith(mockRequest, 'non-existing-id');
    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(404);

    const json = await response.json();
    expect(json).toEqual({ message: NOT_FOUND });
  });

  it('should handle validation errors and return appropriate response', async () => {
    const error = new Error('Validation error');
    (validateUser as jest.Mock).mockResolvedValue(undefined); // Assuming validateUser returns undefined on success
    (getUserUseCase as jest.Mock).mockRejectedValue(error);
    (handleApiValidationError as jest.Mock).mockReturnValue(
      NextResponse.json({ message: 'Validation error' }, { status: 400 }),
    );

    const mockRequest = new NextRequest('http://localhost/api/users/user-id', {
      method: 'GET',
    });
    const response = await GET(mockRequest, { params: { id: 'user-id' } });

    expect(validateUser).toHaveBeenCalledWith(mockRequest, 'user-id');
    expect(handleApiValidationError).toHaveBeenCalledWith(error, mockRoute);
    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(400);

    const json = await response.json();
    expect(json).toEqual({ message: 'Validation error' });
  });
});

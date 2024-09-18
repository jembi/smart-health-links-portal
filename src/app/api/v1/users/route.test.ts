/**
 * @jest-environment node
 */

import { NextRequest, NextResponse } from 'next/server';

import { POST } from '@/app/api/v1/users/route';
import { getUserProfile } from '@/app/utils/authentication';
import { handleApiValidationError } from '@/app/utils/error-handler';
import { mapDtoToModel, mapModelToDto } from '@/mappers/user-mapper';
import { HapiFhirServiceFactory } from '@/services/hapi-fhir-factory';
import { IHapiFhirService } from '@/services/hapi-fhir.interface';
import { searchPatientUseCase } from '@/usecases/patient/search-patient';
import { addUserUseCase } from '@/usecases/users/add-user';

jest.mock('@/usecases/users/add-user', () => ({
  addUserUseCase: jest.fn(),
}));

jest.mock('@/app/utils/authentication', () => ({
  getUserProfile: jest.fn(),
}));

jest.mock('@/services/hapi-fhir-factory');

jest.mock('@/usecases/patient/search-patient', () => ({
  searchPatientUseCase: jest.fn(),
}));

jest.mock('@/mappers/user-mapper', () => ({
  mapDtoToModel: jest.fn(),
  mapModelToDto: jest.fn(),
}));

jest.mock('@/app/utils/error-handler', () => ({
  handleApiValidationError: jest.fn(),
}));

describe('POST /api/users', () => {
  const mockCreateUserDto = {
    userId: 'dto-user-id',
    patientId: 'dto-patient-id',
  };

  const mockUserModel = {
    getId: jest.fn().mockReturnValue('user-id'),
    getUserId: jest.fn().mockReturnValue('dto-user-id'),
    getPatientId: jest.fn().mockReturnValue('dto-patient-id'),
  };

  const mockUserDto = {
    id: 'user-id',
    userId: 'dto-user-id',
    patientId: 'dto-patient-id',
  };

  const mockRequest = (body: any) =>
    new NextRequest('http://localhost/api/users', {
      method: 'POST',
      body: JSON.stringify(body),
    });

  const mockRoute = '/api/v1/users';
  let mockService: jest.Mocked<IHapiFhirService>;
  (getUserProfile as jest.Mock).mockResolvedValue(true);

  HapiFhirServiceFactory.getService = jest.fn().mockReturnValue(mockService);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return user DTO and status 201 when user is successfully created', async () => {
    (mapDtoToModel as jest.Mock).mockReturnValue(mockUserModel);
    (addUserUseCase as jest.Mock).mockResolvedValue(mockUserModel);
    (mapModelToDto as jest.Mock).mockReturnValue(mockUserDto);
    (searchPatientUseCase as jest.Mock).mockResolvedValue('patient id');

    const request = mockRequest(mockCreateUserDto);
    const response = await POST(request);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(201);

    const json = await response.json();
    expect(json).toEqual(mockUserDto);
  });

  it('should handle validation errors and return status 400', async () => {
    const error = new Error('Validation error');
    (addUserUseCase as jest.Mock).mockRejectedValue(error);
    (handleApiValidationError as jest.Mock).mockReturnValue(
      NextResponse.json({ message: 'Validation error' }, { status: 400 }),
    );

    const request = mockRequest(mockCreateUserDto);
    const response = await POST(request);

    expect(handleApiValidationError).toHaveBeenCalledWith(
      error,
      expect.anything(),
    );
    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(400);

    const json = await response.json();
    expect(json).toEqual({ message: 'Validation error' });
  });

  it('should handle unexpected errors and return status 500', async () => {
    const error = new Error('Unexpected error');
    (addUserUseCase as jest.Mock).mockRejectedValue(error);
    (handleApiValidationError as jest.Mock).mockReturnValue(
      NextResponse.json({ message: 'Unexpected error' }, { status: 500 }),
    );

    const request = mockRequest(mockCreateUserDto);
    const response = await POST(request);

    expect(handleApiValidationError).toHaveBeenCalledWith(
      error,
      expect.anything(),
    );
    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(500);

    const json = await response.json();
    expect(json).toEqual({ message: 'Unexpected error' });
  });
});

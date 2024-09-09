/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server';

import { NOT_FOUND } from '@/app/constants/http-constants';
import { handleApiValidationError } from '@/app/utils/error-handler';
import { ExternalDataFetchError } from '@/services/hapi-fhir.service';
import { getPatientDataUseCase } from '@/usecases/patient/get-patient-data';
import { getUserUseCase } from '@/usecases/users/get-user';

import { GET } from './route';

// Mock dependencies
jest.mock('@/app/utils/error-handler', () => ({
  handleApiValidationError: jest.fn(),
}));

jest.mock('@/usecases/patient/get-patient-data', () => ({
  getPatientDataUseCase: jest.fn(),
}));

jest.mock('@/usecases/users/get-user', () => ({
  getUserUseCase: jest.fn(),
}));

describe('GET handler', () => {
  const mockRequest = (id: string) =>
    new NextRequest(`http://localhost/api/users/${id}/ips`, {
      headers: new Headers(),
      method: 'GET',
    });

  it('should return 404 if user is not found', async () => {
    (getUserUseCase as jest.Mock).mockResolvedValue(null);

    const request = mockRequest('non-existing-id');
    const response = await GET(request, { params: { id: 'non-existing-id' } });

    expect(response.status).toBe(404);
    const jsonResponse = await response.json();
    expect(jsonResponse).toEqual({ message: NOT_FOUND });
  });

  it('should return 200 and patient data if user is found', async () => {
    const mockUser = { id: 'existing-id', name: 'John Doe' };
    const mockPatientData = { data: 'patient data' };

    (getUserUseCase as jest.Mock).mockResolvedValue(mockUser);
    (getPatientDataUseCase as jest.Mock).mockResolvedValue(mockPatientData);

    const request = mockRequest('existing-id');
    const response = await GET(request, { params: { id: 'existing-id' } });

    expect(response.status).toBe(200);
    const jsonResponse = await response.json();
    expect(jsonResponse).toEqual(mockPatientData);
  });

  it('should handle errors correctly', async () => {
    const mockUser = { id: 'existing-id', name: 'John Doe' };

    (getUserUseCase as jest.Mock).mockResolvedValue(mockUser);
    (getPatientDataUseCase as jest.Mock).mockRejectedValue(
      new ExternalDataFetchError('Test error'),
    );

    const request = mockRequest('existing-id');
    await GET(request, { params: { id: 'existing-id' } });

    expect(handleApiValidationError).toHaveBeenCalledWith(
      expect.any(ExternalDataFetchError),
    );
  });
});

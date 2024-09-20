/**
 * @jest-environment node
 */

import { NextRequest, NextResponse } from 'next/server';

import {
  NOT_FOUND,
  UNAUTHORIZED_REQUEST,
} from '@/app/constants/http-constants';
import { AccessTicketModel } from '@/domain/models/access-ticket';
import { SHLinkModel } from '@/domain/models/shlink';
import { UserModel } from '@/domain/models/user';
import { getAccessTicketUseCase } from '@/usecases/access-tickets/get-access-ticket';
import { getPatientDataUseCase } from '@/usecases/patient/get-patient-data';
import { getSingleSHLinkUseCase } from '@/usecases/shlinks/get-single-shlink';
import { getUserUseCase } from '@/usecases/users/get-user';

import { GET } from './route';

jest.mock('@/usecases/access-tickets/get-access-ticket');
jest.mock('@/usecases/patient/get-patient-data');
jest.mock('@/usecases/shlinks/get-single-shlink');
jest.mock('@/usecases/users/get-user');

describe('GET /api/v1/share-links/[id]/endpoints/[endpointId]', () => {
  const mockRequest = (ticketId: string | null) => {
    const url = new URL(
      'http://localhost/api/v1/share-links/12356/endpoints/endpoint?ticket=' +
        ticketId,
    );
    return new NextRequest(url.toString(), { method: 'GET' });
  };

  const mockParams = {
    id: '12356',
    endpointId: 'endpoint12345',
    ticket: '123456789',
  };

  const mockRoute = '/api/v1/share-links/{id}/endpoints/{endpointId}';

  const mockTicket = new AccessTicketModel('abc', 'ticket-123');
  const mockShlink = new SHLinkModel(
    'user-123456',
    'name',
    3,
    true,
    'token-xydedz',
    'passcode',
    new Date(),
    'abc',
  );
  const mockUser = new UserModel('user-123', 'patient-123', '12356');

  it('should return 401 if ticket is not found', async () => {
    (getAccessTicketUseCase as jest.Mock).mockResolvedValue(null);

    const request = mockRequest('invalid-ticket');
    const response = await GET(request, { params: mockParams });

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(401);
    const responseBody = await response.json();
    expect(responseBody).toEqual({ message: UNAUTHORIZED_REQUEST });
  });

  it('should return 404 if SHLink is not found', async () => {
    (getAccessTicketUseCase as jest.Mock).mockResolvedValue(mockTicket);
    (getSingleSHLinkUseCase as jest.Mock).mockResolvedValue(null);

    const request = mockRequest('123456789');
    const response = await GET(request, {
      params: { id: 'abc', endpointId: '' },
    });

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(404);
    const responseBody = await response.json();
    expect(responseBody).toEqual({ message: NOT_FOUND });
  });

  it('should return 401 if user is not authorized', async () => {
    (getAccessTicketUseCase as jest.Mock).mockResolvedValue(mockTicket);
    (getSingleSHLinkUseCase as jest.Mock).mockResolvedValue(mockShlink);
    (getUserUseCase as jest.Mock).mockResolvedValue(null);

    const request = mockRequest('valid-ticket');
    const response = await GET(request, { params: mockParams });

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(401);
    const responseBody = await response.json();
    expect(responseBody).toEqual({ message: UNAUTHORIZED_REQUEST });
  });

  it('should return 200 with patient data if everything is valid', async () => {
    (getAccessTicketUseCase as jest.Mock).mockResolvedValue(mockTicket);
    (getSingleSHLinkUseCase as jest.Mock).mockResolvedValue(mockShlink);
    (getUserUseCase as jest.Mock).mockResolvedValue(mockUser);
    (getPatientDataUseCase as jest.Mock).mockResolvedValue({
      data: 'patient data',
    });

    const mockPatientData = { data: 'patient data' };

    const request = mockRequest('123456789');
    const response = await GET(request, {
      params: { id: 'abc', endpointId: 'endpoint12345' },
    });

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(200);
    const jsonResponse = await response.json();
    expect(jsonResponse).toEqual(mockPatientData);
  });

  it('should return 401 if patient data is not found', async () => {
    (getAccessTicketUseCase as jest.Mock).mockResolvedValue(mockTicket);
    (getSingleSHLinkUseCase as jest.Mock).mockResolvedValue(mockShlink);
    (getUserUseCase as jest.Mock).mockResolvedValue(mockUser);
    (getPatientDataUseCase as jest.Mock).mockResolvedValue(null);

    const request = mockRequest('valid-ticket');
    const response = await GET(request, { params: mockParams });

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(401);
    const responseBody = await response.json();
    expect(responseBody).toEqual({ message: UNAUTHORIZED_REQUEST });
  });
});

/**
 * @jest-environment node
 */
import { NextResponse } from 'next/server';

import { NOT_FOUND } from '@/app/constants/http-constants';
import { handleApiValidationError } from '@/app/utils/error-handler';
import { getSHLinkQRCodeUseCase } from '@/usecases/shlink-qrcode/get-shlink-qrcode';
import { getSingleSHLinkUseCase } from '@/usecases/shlinks/get-single-shlink';

import { POST } from './route';

// Mock dependencies
jest.mock('@/usecases/shlinks/get-single-shlink');
jest.mock('@/usecases/shlink-qrcode/get-shlink-qrcode');
jest.mock('@/app/utils/error-handler');

describe('POST /api/v1/shlinks/{id}/qrcode', () => {
  const mockRequestDto = {
    managementToken: 'mock-management-token',
  };

  const mockSHLink = {
    id: '123',
    userId: 'user123',
    name: 'Example SHLink',
    passcodeFailuresRemaining: 5,
    active: true,
    managementToken: "token-xyz1234",
    configPasscode: "passcode-abcde",
    configExp: new Date("2024-01-01T00:00:00Z")
  };

  const mockParams = { id: '123' };

  const mockRoute = '/api/v1/share-links/{id}/qrcode';

  const mockRequest = {
    json: jest.fn().mockResolvedValue(mockRequestDto),
  } as unknown as Request;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 with the QR code image buffer', async () => {
    const mockImageBuffer = Buffer.from('mock-image-buffer');

    (getSingleSHLinkUseCase as jest.Mock).mockResolvedValue(mockSHLink);
    (getSHLinkQRCodeUseCase as jest.Mock).mockResolvedValue(mockImageBuffer);

    const response = await POST(mockRequest, { params: mockParams });

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('image/png');
    expect(response.headers.get('Content-Length')).toBe(mockImageBuffer.length.toString());

    const buffer = await response.arrayBuffer();
    expect(Buffer.from(buffer)).toEqual(mockImageBuffer);

    expect(getSingleSHLinkUseCase).toHaveBeenCalledWith({ repo: expect.anything() }, { id: mockParams.id, managementToken: mockRequestDto.managementToken });
    expect(getSHLinkQRCodeUseCase).toHaveBeenCalledWith(mockSHLink);
  });

  it('should return 404 if the SHLink is not found', async () => {
    (getSingleSHLinkUseCase as jest.Mock).mockResolvedValue(null);

    const response = await POST(mockRequest, { params: mockParams });

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ message: NOT_FOUND });

    expect(getSingleSHLinkUseCase).toHaveBeenCalledWith({ repo: expect.anything() }, { id: mockParams.id, managementToken: mockRequestDto.managementToken });
    expect(getSHLinkQRCodeUseCase).not.toHaveBeenCalled();
  });

  it('should handle errors by calling handleApiValidationError', async () => {
    const mockError = new Error('Test error');

    (getSingleSHLinkUseCase as jest.Mock).mockRejectedValue(mockError);

    await POST(mockRequest, { params: mockParams });

    expect(handleApiValidationError).toHaveBeenCalledWith(mockError, expect.anything());
  });
});

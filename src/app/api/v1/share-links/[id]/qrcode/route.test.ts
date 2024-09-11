
/**
 * @jest-environment node
 */
import { NextResponse } from 'next/server';
import QRCode from 'qrcode';

import { NOT_FOUND } from '@/app/constants/http-constants';
import { handleApiValidationError } from '@/app/utils/error-handler';
import { encodeSHLink } from '@/mappers/shlink-mapper';
import { getSingleSHLinkUseCase } from '@/usecases/shlinks/get-single-shlink';

import { POST } from './route';


// Mock dependencies
jest.mock('qrcode');
jest.mock('@/usecases/shlinks/get-single-shlink');
jest.mock('@/mappers/shlink-mapper');
jest.mock('@/app/utils/error-handler');

describe('POST /api/v1/shlinks/{id}/qrcode', () => {
  const mockRequest = (body: any) => ({
    json: jest.fn().mockResolvedValue(body),
  } as unknown as Request);

  const params = { id: '123' };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and a PNG QR code when valid ID and management token are provided', async () => {
    const requestDto = { managementToken: 'test-token' };
    const mockSHLink = { id: '123', url: 'https://example.com' };
    const mockQrCodeData = 'mock-qr-code-data';
    const mockQrCodeDataUrl = 'data:image/png;base64,mock-qr-code-url';

    (getSingleSHLinkUseCase as jest.Mock).mockResolvedValue(mockSHLink);
    (encodeSHLink as jest.Mock).mockReturnValue(mockQrCodeData);
    (QRCode.toDataURL as jest.Mock).mockResolvedValue(mockQrCodeDataUrl);

    const request = mockRequest(requestDto);
    const response = await POST(request, { params });
    
    const result = await response.arrayBuffer();

    // Check that the right use cases and functions were called
    expect(getSingleSHLinkUseCase).toHaveBeenCalledWith(
      { repo: expect.anything() },
      { id: '123', managementToken: 'test-token' }
    );
    expect(encodeSHLink).toHaveBeenCalledWith(mockSHLink);
    expect(QRCode.toDataURL).toHaveBeenCalledWith(mockQrCodeData);

    // Check that the response is successful and returns the image
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('image/png');
    expect(result.byteLength).toBeGreaterThan(0); // Ensures the buffer is not empty
  });

  it('should return 404 if the SHLink is not found', async () => {
    const requestDto = { managementToken: 'test-token' };

    (getSingleSHLinkUseCase as jest.Mock).mockResolvedValue(null);

    const request = mockRequest(requestDto);
    const response = await POST(request, { params });
    const result = await response.json();

    expect(response.status).toBe(404);
    expect(result.message).toBe(NOT_FOUND);
  });

  it('should return 500 if the QR code generation fails', async () => {
    const requestDto = { managementToken: 'test-token' };
    const mockSHLink = { id: '123', url: 'https://example.com' };
    const mockQrCodeData = 'mock-qr-code-data';

    (getSingleSHLinkUseCase as jest.Mock).mockResolvedValue(mockSHLink);
    (encodeSHLink as jest.Mock).mockReturnValue(mockQrCodeData);
    (QRCode.toDataURL as jest.Mock).mockResolvedValue('data:image/png;base64,');

    const request = mockRequest(requestDto);
    const response = await POST(request, { params });
    const result = await response.json();

    expect(response.status).toBe(500);
    expect(result.message).toBe('Failed to generate QR code');
  });

  it('should handle unexpected errors and return a 500 status', async () => {
    const requestDto = { managementToken: 'test-token' };
    const mockError = new Error('Unexpected error');

    (getSingleSHLinkUseCase as jest.Mock).mockRejectedValue(mockError);

    const mockHandleError = (handleApiValidationError as jest.Mock).mockReturnValue(
      NextResponse.json({ message: 'Error' }, { status: 500 })
    );

    const request = mockRequest(requestDto);
    const response = await POST(request, { params });

    expect(handleApiValidationError).toHaveBeenCalledWith(mockError);
    expect(response.status).toBe(500);
  });
});
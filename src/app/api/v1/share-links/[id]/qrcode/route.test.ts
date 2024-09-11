
/**
 * @jest-environment node
 */
import { NextResponse } from 'next/server';
import QRCode from 'qrcode';

import { NOT_FOUND } from '@/app/constants/http-constants';
import { handleApiValidationError } from '@/app/utils/error-handler';
import { encodeSHLink } from '@/mappers/shlink-mapper';
import { getSingleSHLinkUseCase } from '@/usecases/shlinks/get-single-shlink';

import { GET } from './route';


// Mock dependencies
jest.mock('qrcode');
jest.mock('@/usecases/shlinks/get-single-shlink');
jest.mock('@/mappers/shlink-mapper');
jest.mock('@/app/utils/error-handler');

describe('GET /api/shlink/:id/qrcode', () => {
  
  const request = new Request('http://localhost/api/shlink/123/qrcode?managementToken=test-token');
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('should return 200 and the QR code when valid ID and management token are provided', async () => {
    const params = { id: '123' };
    
    const mockSHLink = { id: '123', url: 'https://example.com' };
    const mockQrCodeData = 'mock-qr-code-data';
    const mockQrCodeDataUrl = 'data:image/png;base64,mock-qr-code-url';
    
    (getSingleSHLinkUseCase as jest.Mock).mockResolvedValue(mockSHLink);
    (encodeSHLink as jest.Mock).mockReturnValue(mockQrCodeData);
    (QRCode.toDataURL as jest.Mock).mockResolvedValue(mockQrCodeDataUrl);
    
    const response = await GET(request, { params });
    const result = await response.json();
    
    expect(getSingleSHLinkUseCase).toHaveBeenCalledWith(
      { repo: expect.anything() },
      { id: '123', managementToken: 'test-token' }
    );
    expect(encodeSHLink).toHaveBeenCalledWith(mockSHLink);
    expect(QRCode.toDataURL).toHaveBeenCalledWith(mockQrCodeData);
    
    expect(response.status).toBe(200);
    expect(result.qrCode).toBe(mockQrCodeDataUrl);
  });
  
  it('should return 404 if ID is missing', async () => {
    const requestWithoutToken = new Request('http://localhost/api/shlink/qrcode');
    const params = { id: null };

    const response = await GET(requestWithoutToken, { params });
    const result = await response.json();
    
    expect(response.status).toBe(404);
    expect(result.message).toBe(NOT_FOUND);
  });

  it('should return 404 if the SHLink is not found', async () => {
    const params = { id: '123' };
    
    (getSingleSHLinkUseCase as jest.Mock).mockResolvedValue(null);
    
    const response = await GET(request, { params });
    const result = await response.json();
    
    expect(response.status).toBe(404);
    expect(result.message).toBe(NOT_FOUND);
  });
  
  it('should handle errors and return the correct response', async () => {
    const params = { id: '123' };
    
    const mockError = new Error('Unexpected error');
    (getSingleSHLinkUseCase as jest.Mock).mockRejectedValue(mockError);
    
    const mockHandleError = (handleApiValidationError as jest.Mock).mockReturnValue(
      NextResponse.json({ message: 'Error' }, { status: 500 })
    );
    
    const response = await GET(request, { params });
    
    expect(handleApiValidationError).toHaveBeenCalledWith(mockError);
    expect(response.status).toBe(500);
  });
});

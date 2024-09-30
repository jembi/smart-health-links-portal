import QRCode from 'qrcode';

import { SHLinkModel } from '@/domain/models/shlink';
import { encodeSHLink } from '@/mappers/shlink-mapper';

import { getSHLinkQRCodeUseCase } from './get-shlink-qrcode';

// Mock dependencies
jest.mock('qrcode');
jest.mock('@/mappers/shlink-mapper');

describe('getSHLinkQRCodeUseCase', () => {
  // Create a mock SHLink object using the constructor
  const mockSHLink = new SHLinkModel(
    'users12345',         
    'Example SHLink',   
    5,                 
    true,            
    'testing-token',      
    'pass12345',          
    new Date(),      
    '123',
    new Date('2024-01-01T00:00:00Z'),
    new Date('2024-01-01T00:00:00Z'),
    null           
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an image buffer when QR code generation is successful', async () => {
    const mockQrCodeData = 'mock-qr-code-data';
    const mockQrCodeDataUrl = 'data:image/png;base64,mock-qr-code-url';

    (encodeSHLink as jest.Mock).mockResolvedValue(mockQrCodeData);
    (QRCode.toDataURL as jest.Mock).mockResolvedValue(mockQrCodeDataUrl);

    const result = await getSHLinkQRCodeUseCase(mockSHLink);

    const expectedBase64 = mockQrCodeDataUrl.split(';base64,').pop() as string;
    const expectedBuffer = Buffer.from(expectedBase64, 'base64');

    expect(encodeSHLink).toHaveBeenCalledWith(mockSHLink);
    expect(QRCode.toDataURL).toHaveBeenCalledWith(mockQrCodeData);
    expect(result).toEqual(expectedBuffer);
  });

  it('should throw an error if QR code generation fails', async () => {
    const mockQrCodeData = 'mock-qr-code-data';
    const invalidQrCodeDataUrl = 'data:image/png;base64,';

    (encodeSHLink as jest.Mock).mockResolvedValue(mockQrCodeData);
    (QRCode.toDataURL as jest.Mock).mockResolvedValue(invalidQrCodeDataUrl);

    await expect(getSHLinkQRCodeUseCase(mockSHLink)).rejects.toThrow('Failed to generate QR code');

    expect(encodeSHLink).toHaveBeenCalledWith(mockSHLink);
    expect(QRCode.toDataURL).toHaveBeenCalledWith(mockQrCodeData);
  });
});

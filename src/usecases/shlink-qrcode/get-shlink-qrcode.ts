import QRCode from 'qrcode';

import { SHLinkModel } from '@/domain/models/shlink';
import { encodeSHLink } from '@/mappers/shlink-mapper';


export const getSHLinkQRCodeUseCase = async (shlink: SHLinkModel) => {
    let qrCodeData = await encodeSHLink(shlink)

    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeData);

    const base64Image = qrCodeDataUrl.split(';base64,').pop();
    
    if (!base64Image) {
      throw new Error('Failed to generate QR code')
    }

    const imageBuffer = Buffer.from(base64Image, 'base64');

    return imageBuffer
};

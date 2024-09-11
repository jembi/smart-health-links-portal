import { NextResponse } from 'next/server';
import QRCode from 'qrcode';

import {
  INVALID_SHLINK_CREDS,
  NOT_FOUND,
  UNAUTHORIZED_REQUEST,
} from '@/app/constants/http-constants';
import { handleApiValidationError } from '@/app/utils/error-handler';
import { container, SHLinkEndpointRepositoryToken, SHLinkRepositoryToken } from '@/container';
import { SHLinkQRCodeRequestDto } from '@/domain/dtos/shlink-qrcode';
import { ISHLinkRepository } from '@/infrastructure/repositories/interfaces/shlink-repository';
import { encodeSHLink } from '@/mappers/shlink-mapper';
import { getSingleSHLinkUseCase } from '@/usecases/shlinks/get-single-shlink';

const shlinkRepo = container.get<ISHLinkRepository>(SHLinkRepositoryToken);

export async function GET(request: Request, { params }: {params: { id: string } }) {
    
  try {
    const { searchParams } = new URL(request.url);
    const managementToken = searchParams.get('managementToken');
    const requestDto: SHLinkQRCodeRequestDto = {
        managementToken: managementToken
    }
    const { id } = params;

    if (!id) {
      return NextResponse.json({message: NOT_FOUND}, {status: 404});
    }

    let shlink = await getSingleSHLinkUseCase(
      {repo: shlinkRepo},
      {id: params.id, managementToken: requestDto.managementToken},
    );
    if (!shlink)
      return NextResponse.json({message: NOT_FOUND}, {status: 404});

    let qrCodeData = await encodeSHLink(shlink)

    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeData);

    return NextResponse.json({ qrCode: qrCodeDataUrl }, { status: 200 });

  } catch (error) {
    return handleApiValidationError(error);
  }
}

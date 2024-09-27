'use client';
import {
  ContentCopy,
  Check,
  FileCopy,
  KeyboardBackspace,
} from '@mui/icons-material';
import {
  Dialog,
  DialogContent,
  Button,
  CircularProgress,
  Grid,
} from '@mui/material';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react';

import { StyledButton } from '@/app/components/StyledButton';
import { StyledDialogActions } from '@/app/components/StyledDialogActions';
import { StyledDialogContent } from '@/app/components/StyledDialogContent';
import { StyledDialogTitle } from '@/app/components/StyledDialogTitle';
import { apiQrCode } from '@/app/services/endpoints/qr-code.class';
import { clipboard } from '@/app/utils/helpers';
import { type CreateSHLinkDto } from '@/domain/dtos/shlink';

export type TCreateSHLinkDto = Omit<CreateSHLinkDto, 'configExp'> & {
  configExp?: string;
};

interface QRCodeDialogProps {
  open?: boolean;
  data?: {
    id: string;
    url: string;
    managementToken: string;
  };
  onClose?: () => void;
}

type TCopyStatus = 'loading' | 'copy' | 'copied';

export const QRCodeDialog: FC<QRCodeDialogProps> = ({
  open,
  data,
  onClose,
}) => {
  const [qrCodeBlob, setQrCodeBlob] = useState<Blob | undefined>();
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [QrCopyStatus, setQrCopyStatus] = useState<TCopyStatus>('copy');
  const [linkCopyStatus, setLinkCopyStatus] = useState<TCopyStatus>('copy');

  useEffect(() => {
    if (open && data?.id) {
      apiQrCode
        .getQrCode(data.id, {
          managementToken: data?.managementToken,
        })
        .then(({ data }) => {
          setQrCodeUrl(
            `data:image/png;base64,${Buffer.from(data, 'binary').toString('base64')}`,
          );
          setQrCodeBlob(new Blob([data], { type: 'image/png' }));
        });
    }
  }, [data?.id, data?.managementToken, open]);

  return (
    <Dialog open={!!open} fullWidth maxWidth="xs" onClose={() => onClose?.()}>
      <StyledDialogTitle>Scan your QR Code</StyledDialogTitle>
      <DialogContent style={{ padding: '5px 8px' }}>
        <StyledDialogContent>
          <Grid container direction="column" gap="5px">
            <Grid
              item
              sx={{
                width: '260px',
                height: '260px',
                display: 'flex',
                margin: 'auto',
              }}
              justifyContent="center"
              alignItems="center"
            >
              {qrCodeUrl ? (
                <Image
                  alt=""
                  src={qrCodeUrl}
                  width={260}
                  height={260}
                  style={{ margin: 'auto' }}
                />
              ) : (
                <CircularProgress />
              )}
            </Grid>
            <Grid item textAlign="center">
              <StyledButton
                sx={{
                  maxWidth: '240px',
                }}
                fullWidth
                disabled={!qrCodeUrl || QrCopyStatus === 'loading'}
                type="submit"
                color={QrCopyStatus === 'copied' ? 'success' : 'info'}
                variant="contained"
                onClick={async () => {
                  if (qrCodeBlob) {
                    setQrCopyStatus('loading');

                    await clipboard(qrCodeBlob);

                    setTimeout(() => {
                      setQrCopyStatus('copied');
                      setLinkCopyStatus('copy');
                    }, 500);
                  }
                }}
              >
                {QrCopyStatus === 'copied' ? (
                  <>
                    <Check sx={{ fontSize: '20px', pr: '3px' }} />
                    QR Code Copied
                  </>
                ) : QrCopyStatus === 'copy' ? (
                  <>
                    <ContentCopy sx={{ fontSize: '20px', pr: '3px' }} />
                    Copy QR Code
                  </>
                ) : (
                  <>
                    <FileCopy sx={{ fontSize: '20px', pr: '3px' }} />
                    Coping QR Code
                  </>
                )}
              </StyledButton>
            </Grid>
            <Grid item textAlign="center">
              <StyledButton
                sx={{
                  maxWidth: '240px',
                }}
                fullWidth
                disabled={!qrCodeUrl || linkCopyStatus === 'loading'}
                type="submit"
                color={linkCopyStatus === 'copied' ? 'success' : 'info'}
                variant="contained"
                onClick={async () => {
                  if (qrCodeBlob && data?.url) {
                    setLinkCopyStatus('loading');

                    await clipboard(data.url);

                    setTimeout(() => {
                      setLinkCopyStatus('copied');
                      setQrCopyStatus('copy');
                    }, 500);
                  }
                }}
              >
                {linkCopyStatus === 'copied' ? (
                  <>
                    <Check sx={{ fontSize: '20px', pr: '3px' }} />
                    Link Copied
                  </>
                ) : linkCopyStatus === 'copy' ? (
                  <>
                    <ContentCopy sx={{ fontSize: '20px', pr: '3px' }} />
                    Copy link
                  </>
                ) : (
                  <>
                    <FileCopy sx={{ fontSize: '20px', pr: '3px' }} />
                    Coping link
                  </>
                )}
              </StyledButton>
            </Grid>
          </Grid>
        </StyledDialogContent>
      </DialogContent>
      <StyledDialogActions>
        <Button onClick={onClose}>
          <KeyboardBackspace sx={{ paddingRight: '4px', marginRight: '4px' }} />
          Back
        </Button>
      </StyledDialogActions>
    </Dialog>
  );
};

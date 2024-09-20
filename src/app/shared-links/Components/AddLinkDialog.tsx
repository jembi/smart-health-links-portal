'use client';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  styled,
} from '@mui/material';
import { ChangeEvent, FC, useState } from 'react';

import { useSession } from '@/app/hooks/useSession';
import { apiClient } from '@/app/utils/api.class';
import { CreateSHLinkDto } from '@/domain/dtos/shlink';

const removeUndefinedValues = (object: Object) =>
  JSON.parse(JSON.stringify(object));

const StyledDialogTitle = styled(DialogTitle)(() => ({
  backgroundImage: 'linear-gradient(to bottom, hsla(0, 0%, 90%, .05), #e6e6e6)',
}));

const StyledDialogContent = styled(DialogContent)(() => ({
  gap: '15px',
  margin: '15px',
  display: 'flex',
  flexDirection: 'column',
}));

const StyledDialogActions = styled(DialogActions)(() => ({
  paddingTop: '15px',
  paddingRight: '25px',
  paddingBottom: '15px',
  backgroundImage: 'linear-gradient(to top, hsla(0, 0%, 90%, .05), #e6e6e6)',
}));

const createSHLink = (url: string, data: object, callback?: () => void) =>
  apiClient
    .create({
      url,
      data,
    })
    .then(() => callback?.());

type TCreateSHLinkDto = Omit<CreateSHLinkDto, 'configExp'> & {
  configExp?: string;
};

interface AddLinkDialogProps {
  open?: boolean;
  onClose?: () => void;
  callback?: () => void;
}

export const AddLinkDialog: FC<AddLinkDialogProps> = ({
  open,
  onClose,
  callback,
}) => {
  const data = useSession();
  const [payload, setPayload] = useState<Partial<TCreateSHLinkDto>>({});

  const handleChange =
    (field: keyof TCreateSHLinkDto) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setPayload((currentPayload) => ({
        ...currentPayload,
        [field]: event.target.value || undefined,
      }));
    };

  return (
    <Dialog open={!!open} fullWidth maxWidth="xs" onClose={() => onClose?.()}>
      <StyledDialogTitle>Create a new Link</StyledDialogTitle>
      <StyledDialogContent style={{ padding: '5px 8px' }}>
        <TextField
          type="text"
          label="User id *"
          value={data?.token?.sub}
          disabled
          inputProps={{ readOnly: true }}
        />
        <TextField
          type="text"
          label="Name *"
          onChange={handleChange('name')}
          placeholder="Name"
          defaultValue=""
        />
        <TextField
          type="number"
          label="PIN Code"
          onChange={handleChange('configPasscode')}
          defaultValue=""
        />
        <TextField
          type="date"
          label="Expiration Date"
          onChange={handleChange('configExp')}
          InputLabelProps={{ shrink: true }}
        />
      </StyledDialogContent>
      <StyledDialogActions>
        <Button color="inherit" variant="contained" onClick={onClose}>
          Cancel
        </Button>
        <Button
          color="success"
          variant="contained"
          onClick={() =>
            createSHLink(
              '/api/v1/share-links',
              removeUndefinedValues({ ...payload, userId: data?.token?.sub }),
              () => {
                callback?.();
                onClose?.();
              },
            )
          }
        >
          Create
        </Button>
      </StyledDialogActions>
    </Dialog>
  );
};

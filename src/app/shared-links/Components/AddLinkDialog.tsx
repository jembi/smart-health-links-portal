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
import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useSession } from '@/app/hooks/useSession';
import { apiClient } from '@/app/utils/api.class';
import { CreateSHLinkDto } from '@/domain/dtos/shlink';

const removeUndefinedValues = (object: Object) =>
  JSON.parse(JSON.stringify(object));

const StyledDialogTitle = styled(DialogTitle)(() => ({
  backgroundImage: 'linear-gradient(to bottom, hsla(0, 0%, 90%, .05), #e6e6e6)',
}));

const StyledDialogContent = styled('div')(() => ({
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
  const {
    reset,
    register,
    formState: { errors },
    resetField,
    handleSubmit,
  } = useForm<TCreateSHLinkDto>();

  const onSubmitForm = async (data: TCreateSHLinkDto) => {
    await apiClient
      .create({
        url: '/share-links',
        data: removeUndefinedValues(data),
      })
      .then(() => callback?.());
  };

  useEffect(() => {
    if (open) reset();
  }, [open]);

  useEffect(() => {
    if (data?.token?.sub)
      resetField('userId', { defaultValue: data.token.sub });
  }, [data?.token?.sub]);

  return (
    <Dialog open={!!open} fullWidth maxWidth="xs" onClose={() => onClose?.()}>
      <StyledDialogTitle>Create a new Link</StyledDialogTitle>
      <DialogContent style={{ padding: '5px 8px' }}>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <StyledDialogContent>
            <TextField
              label="User id"
              error={!!errors.userId}
              disabled
              required
              inputProps={{ readOnly: true }}
              {...register('userId', {})}
            />
            <TextField
              label="Name"
              error={!!errors.name}
              required
              helperText={errors.name ? errors.name.message : null}
              placeholder="Name"
              {...register('name', { required: 'Required field' })}
            />
            <TextField
              type="number"
              label="PIN Code"
              {...register('configPasscode', {
                setValueAs: (value) => value || undefined,
              })}
            />
            <TextField
              type="date"
              label="Expiration Date"
              InputLabelProps={{ shrink: true }}
              {...register('configExp', {
                setValueAs: (value) => value || undefined,
              })}
            />
          </StyledDialogContent>
        </form>
      </DialogContent>
      <StyledDialogActions>
        <Button color="inherit" variant="contained" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          color="success"
          variant="contained"
          onClick={handleSubmit(onSubmitForm)}
        >
          Create
        </Button>
      </StyledDialogActions>
    </Dialog>
  );
};

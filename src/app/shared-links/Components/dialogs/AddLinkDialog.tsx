'use client';
import { KeyboardBackspace, Send } from '@mui/icons-material';
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Alert,
  Grid,
} from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { StyledButton } from '@/app/components/StyledButton';
import { StyledDialogActions } from '@/app/components/StyledDialogActions';
import { StyledDialogContent } from '@/app/components/StyledDialogContent';
import { StyledDialogTitle } from '@/app/components/StyledDialogTitle';
import { useAuth } from '@/app/context/AuthProvider';
import { apiEndpoint } from '@/app/services/endpoints/endpoint.class';
import { apiSharedLink } from '@/app/services/endpoints/share-link.class';
import { type CreateSHLinkDto } from '@/domain/dtos/shlink';

const removeUndefinedValues = <T extends Record<string, unknown>>(
  object: T,
): T => JSON.parse(JSON.stringify(object));

export type TCreateSHLinkDto = Omit<CreateSHLinkDto, 'configExp'> & {
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
  const { session } = useAuth();
  const [hasError, setHasError] = useState(false);
  const [disableButton, setDisableButton] = useState(false);

  const {
    reset,
    register,
    formState: { errors },
    resetField,
    handleSubmit,
  } = useForm<TCreateSHLinkDto>();

  const onSubmitForm = async (data: TCreateSHLinkDto) => {
    setDisableButton(true);
    try {
      const transformedData = removeUndefinedValues(data);
      const { data: createdLink } =
        await apiSharedLink.createLink(transformedData);
      await apiEndpoint
        .createEndpoint(createdLink.id)
        .then(() => {
          callback?.();
        })
        .catch(() => {
          setHasError(true);
        });
    } catch (error) {
      console.error('Failed to create link:', error);
    }
  };

  useEffect(() => {
    if (open) {
      reset();
      setHasError(false);
      setDisableButton(false);
    }
  }, [open]);

  useEffect(() => {
    if (session?.token?.sub)
      resetField('userId', { defaultValue: session.token.sub });
  }, [session?.token?.sub]);

  return (
    <Dialog open={!!open} fullWidth maxWidth="xs" onClose={() => onClose?.()}>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <StyledDialogTitle>Create a new Link</StyledDialogTitle>
        <DialogContent style={{ padding: '5px 8px' }}>
          <StyledDialogContent>
            {hasError && (
              <Grid pb={2}>
                <Alert severity="error">
                  The creation of the endpoint is failed
                </Alert>
              </Grid>
            )}
            <TextField
              label="User id"
              error={!!errors.userId}
              disabled
              required
              inputProps={{ readOnly: true }}
              {...register('userId', {})}
            />
            <TextField
              label="Name *"
              error={!!errors.name}
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
              InputProps={{
                inputProps: { min: new Date().toISOString().split('T')[0] },
              }}
              {...register('configExp', {
                setValueAs: (value) => value || undefined,
              })}
            />
          </StyledDialogContent>
        </DialogContent>
        <StyledDialogActions>
          <Button onClick={onClose}>
            <KeyboardBackspace
              sx={{ paddingRight: '4px', marginRight: '4px' }}
            />
            Back
          </Button>
          <StyledButton
            type="submit"
            color="success"
            variant="contained"
            disabled={disableButton}
          >
            <Send sx={{ paddingRight: '4px', marginRight: '4px' }} />
            Create
          </StyledButton>
        </StyledDialogActions>
      </form>
    </Dialog>
  );
};

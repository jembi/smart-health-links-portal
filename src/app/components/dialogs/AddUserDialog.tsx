'use client';

import { KeyboardBackspace, Send } from '@mui/icons-material';
import {
  Dialog,
  DialogContent,
  Grid,
  Alert,
  TextField,
  Button,
} from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useAuth } from '@/app/context/AuthProvider';
import { apiUser } from '@/app/services/endpoints/user.class';
import { CreateUserDto } from '@/domain/dtos/user';

import { StyledButton } from '../StyledButton';
import { StyledDialogActions } from '../StyledDialogActions';
import { StyledDialogContent } from '../StyledDialogContent';
import { StyledDialogTitle } from '../StyledDialogTitle';

interface AddUserDialogProps {
  open?: boolean;
  onClose?: () => void;
  callback?: () => void;
}

export const AddUserDialog: FC<AddUserDialogProps> = ({
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
  } = useForm<CreateUserDto>();

  const onSubmitForm = async (data: CreateUserDto) => {
    setDisableButton(true);
    try {
      await apiUser
        .createUser(data)
        .then(() => {
          onClose?.();
          callback?.();
        })
        .catch(() => {
          setHasError(true);
          setDisableButton(false);
        });
    } catch (error) {
      console.error('Failed to create user:', error);
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
    <Dialog open={!!open} fullWidth maxWidth="xs">
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <StyledDialogTitle>Verify user details</StyledDialogTitle>
        <DialogContent style={{ padding: '5px 8px' }}>
          <StyledDialogContent>
            {hasError && (
              <Grid pb={2}>
                <Alert severity="error">The creation of a user is failed</Alert>
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
              type="number"
              label="National identity number *"
              {...register('patientId', {
                setValueAs: (value) => value || undefined,
              })}
            />
          </StyledDialogContent>
        </DialogContent>
        <StyledDialogActions sx={{ justifyContent: 'end' }}>
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

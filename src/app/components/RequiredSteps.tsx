'use client';
import { Grid } from '@mui/material';
import React from 'react';

import { AddUserDialog } from './dialogs/AddUserDialog';
import { useAuth } from '../context/AuthProvider';
import { apiUser } from '../services/endpoints/user.class';

export const RequiredSteps = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  const [isCreateUserDialogOpened, setIsCreateUserDialogOpened] =
    React.useState(false);
  const [hasUser, setHasUser] = React.useState(false);
  React.useEffect(() => {
    const fetchUser = async () => {
      await apiUser
        .getUser(user.id)
        .then(({ data }) => {
          setHasUser(true);
          return data;
        })
        .catch((e) => {
          setHasUser(false);
          setIsCreateUserDialogOpened(true);
        });
    };
    fetchUser();
  }, []);

  return (
    <Grid minHeight={'calc(100vh - 137px)'}>
      {hasUser ? (
        children
      ) : (
        <AddUserDialog
          open={isCreateUserDialogOpened}
          onClose={() => {
            setIsCreateUserDialogOpened(false);
          }}
          callback={() => {
            setHasUser(true);
          }}
        />
      )}
    </Grid>
  );
};

'use client';
import { Grid } from '@mui/material';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

import { AddUserDialog } from './dialogs/AddUserDialog';
import { useAuth } from '../context/AuthProvider';
import { apiUser } from '../services/endpoints/user.class';

export const RequiredSteps = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const pathname = usePathname();

  const [isCreateUserDialogOpened, setIsCreateUserDialogOpened] =
    React.useState(false);
  const [hasUser, setHasUser] = React.useState(false);
  const isAnonymous = !isAuthenticated && pathname === '/viewer';

  useEffect(() => {
    const fetchUser = async (id: string) =>
      apiUser
        .getUser(id)
        .then(({ data }) => {
          setHasUser(true);
          return data;
        })
        .catch((e) => {
          setHasUser(false);
          setIsCreateUserDialogOpened(true);
        });

    if (user?.id) fetchUser(user.id);
  }, []);

  return (
    <Grid minHeight={'calc(100vh - 137px)'}>
      {isAnonymous || hasUser ? (
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

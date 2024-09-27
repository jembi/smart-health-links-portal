'use client';

import { Login as LoginIcon } from '@mui/icons-material';
import { Button } from '@mui/material';
import { signIn } from 'next-auth/react';

export default function Login() {
  return (
    <Button
      onClick={() => signIn('keycloak')}
      variant="contained"
      color="secondary"
      sx={{
        backgroundImage:
          'linear-gradient(to bottom, hsla(0, 0%, 90%, .05), #0004)',
      }}
    >
      <LoginIcon
        sx={{ color: '#eee', paddingRight: '4px', marginRight: '4px' }}
      />
      Sign in
    </Button>
  );
}

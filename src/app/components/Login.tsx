'use client';

import { Login as LoginIcon } from '@mui/icons-material';
import { signIn } from 'next-auth/react';

import { StyledButton } from './StyledButton';

export default function Login() {
  return (
    <StyledButton
      onClick={() => signIn('keycloak')}
      variant="contained"
      color="secondary"
    >
      <LoginIcon
        sx={{ color: '#eee', paddingRight: '4px', marginRight: '4px' }}
      />
      Sign in
    </StyledButton>
  );
}

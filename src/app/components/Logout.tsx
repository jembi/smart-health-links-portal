'use client';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { signOut } from 'next-auth/react';

import { StyledButton } from './StyledButton';

export default function Logout() {
  return (
    <Tooltip title="Sign out">
      <StyledButton
        size="small"
        onClick={() => signOut()}
        variant="contained"
        color="error"
      >
        <LogoutIcon sx={{ color: '#eee' }}></LogoutIcon>
      </StyledButton>
    </Tooltip>
  );
}

'use client';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { Button, Tooltip } from '@mui/material';
import { signOut } from 'next-auth/react';

export default function Logout() {
  return (
    <Tooltip title="Sign out">
      <Button
        size="small"
        onClick={() => signOut()}
        variant="contained"
        color="error"
        sx={{
          backgroundImage:
            'linear-gradient(to bottom, hsla(0, 0%, 90%, .05), #0004)',
        }}
      >
        <LogoutIcon sx={{ color: '#eee' }}></LogoutIcon>
      </Button>
    </Tooltip>
  );
}

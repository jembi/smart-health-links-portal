import { Box, Grid, MenuItem } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import NextLink from 'next/link';
import { getServerSession } from 'next-auth';
import * as React from 'react';

import Login from './Login';
import Logout from './Logout';
import { authOptions } from '../api/auth/authOptions';

export default async function Header() {
  const session = await getServerSession(authOptions);

  const AuthButton = session ? (
    <div>
      <div>
        <Logout />
      </div>
      <div>
        Your full name is <b>{session.user?.name}</b>
      </div>
    </div>
  ) : (
    <div>
      <Login />
    </div>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <MenuItem key="home" component={NextLink} href="/">
          Home
        </MenuItem>
        <MenuItem
          key="patient-summary"
          component={NextLink}
          href="/patient-summary"
        >
          Patient Summary View
        </MenuItem>
        <Box sx={{ width: '100%', textAlign: 'right' }}>{AuthButton}</Box>
      </Toolbar>
    </AppBar>
  );
}

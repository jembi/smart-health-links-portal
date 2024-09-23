'use client';
import { Box, MenuItem } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import NextLink from 'next/link';
import * as React from 'react';

import Login from './Login';
import Logout from './Logout';
import { useAuth } from '../context/AuthProvider';

export default function Header() {
  const { isAuthenticated, user } = useAuth();
  const AuthButton = isAuthenticated ? (
    <div>
      <div>
        <Logout />
      </div>
      <div>
        Your full name is <b>{user?.name}</b>
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
        {isAuthenticated && (
          <>
            <MenuItem
              key="patient-summary"
              component={NextLink}
              href="/patient-summary"
            >
              Patient Summary View
            </MenuItem>
            <MenuItem key="dashboard" component={NextLink} href="/shared-links">
              Dashboard
            </MenuItem>
          </>
        )}
        <Box sx={{ width: '100%', textAlign: 'right' }}>{AuthButton}</Box>
      </Toolbar>
    </AppBar>
  );
}

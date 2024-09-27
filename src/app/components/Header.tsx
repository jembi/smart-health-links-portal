'use client';
import { Home, Article, Dashboard } from '@mui/icons-material';
import { Avatar, Box, Grid, MenuItem } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

import Login from './Login';
import Logout from './Logout';
import { useAuth } from '../context/AuthProvider';

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: '#0003',
    },
    children: `${name.split(' ')[0][0].toLocaleUpperCase()}${name.split(' ')[1][0].toLocaleUpperCase()}`,
  };
}

export default function Header() {
  const { isAuthenticated, user } = useAuth();
  const pathname = usePathname();
  const AuthButton = isAuthenticated ? (
    <Grid container alignItems="center" gap="6px" justifyContent="end">
      <Grid item>{user?.name && <Avatar {...stringAvatar(user.name)} />}</Grid>
      <Grid item pr="6px">
        {user?.name}
      </Grid>
      <Grid item>
        <Logout />
      </Grid>
    </Grid>
  ) : (
    <div>
      <Login />
    </div>
  );

  const ACTIVE_BUTTON_STYLE = {
    background: '#fff2',
    borderRadius: '12px',
  } as const;

  return (
    <AppBar sx={{ position: 'fixed', top: '0px' }}>
      <Toolbar sx={{ gap: '6px' }}>
        <MenuItem
          key="home"
          component={NextLink}
          href="/"
          sx={{
            ...(pathname === '/' && ACTIVE_BUTTON_STYLE),
          }}
        >
          <Home
            sx={{ color: '#eee', paddingRight: '4px', marginRight: '3px' }}
          />
          Home
        </MenuItem>
        {isAuthenticated && (
          <>
            <MenuItem
              key="patient-summary"
              component={NextLink}
              href="/patient-summary"
              sx={{
                ...(pathname === '/patient-summary' && ACTIVE_BUTTON_STYLE),
              }}
            >
              <Article
                sx={{ color: '#eee', paddingRight: '4px', marginRight: '3px' }}
              />
              Summary View
            </MenuItem>
            <MenuItem
              key="dashboard"
              component={NextLink}
              href="/shared-links"
              sx={{
                ...(pathname === '/shared-links' && ACTIVE_BUTTON_STYLE),
              }}
            >
              <Dashboard
                sx={{ color: '#eee', paddingRight: '4px', marginRight: '3px' }}
              />
              Dashboard
            </MenuItem>
          </>
        )}
        <Box sx={{ width: '100%', textAlign: 'right' }}>{AuthButton}</Box>
      </Toolbar>
    </AppBar>
  );
}

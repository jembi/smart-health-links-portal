import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import { MenuItem } from '@mui/material';
import NextLink from 'next/link';

export default function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <MenuItem
          key="key1"
          component={NextLink}
          href="/"
        >
          Home
        </MenuItem>
      </Toolbar>
    </AppBar>
  );
}

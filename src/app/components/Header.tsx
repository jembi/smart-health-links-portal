import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

import { Box, Grid, MenuItem } from "@mui/material";
import NextLink from "next/link";
import Logout from "./Logout";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/authOptions";
import Login from "./Login";

export default async function Header() {
  const session = await getServerSession(authOptions);

  const AuthButton = session ? (
    <div>
      <div>
        <Logout />
      </div>
      <div>Your full name is <b>{session.user?.name}</b></div>
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
        <Box sx={{ width: "100%", textAlign: "right" }}>{AuthButton}</Box>
      </Toolbar>
    </AppBar>
  );
}

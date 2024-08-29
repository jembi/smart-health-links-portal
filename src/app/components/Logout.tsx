"use client"

import { Button, Typography } from "@mui/material";
import { signOut } from "next-auth/react";

export default function Logout() {
  return (
    <Button 
      onClick={() => signOut()} 
      variant="contained" 
      color="secondary"
    >
      <Typography>Sign out</Typography>
    </Button>
  );
}
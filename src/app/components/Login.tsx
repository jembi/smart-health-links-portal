"use client"

import { Button } from "@mui/material";
import { signIn } from "next-auth/react";

export default function Login() {
  return (
    <Button 
      onClick={() => signIn("keycloak")} 
      variant="contained" 
      color="secondary">
      Sign in
    </Button>
  );
}
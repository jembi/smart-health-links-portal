import { Box, Typography } from '@mui/material';
import React from 'react';

export default function InfoRow({ label, value }) {
  return (
    <Box display="flex" alignItems="center" gap="4px">
      <Typography mr={0.5}>
        <b>{label}:</b>
      </Typography>
      {value}
    </Box>
  );
}

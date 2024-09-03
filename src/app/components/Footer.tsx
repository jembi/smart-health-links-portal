import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function Footer() {
  return (
    <Box sx={{ bgcolor: 'lightgray', p: 6 }} component="footer">
      <Typography variant="body2" color="text.secondary" align="center">
        Smart Health Links Portal
        <br />
        Built by Jembi Health Systems
      </Typography>
    </Box>
  );
}

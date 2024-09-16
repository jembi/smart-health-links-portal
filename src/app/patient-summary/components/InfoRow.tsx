import { Box, Typography } from '@mui/material';
import { JSX } from 'react';

export default function InfoRow({
  value,
  label,
}: {
  value: string | JSX.Element;
  label?: string;
}) {
  return (
    <Box display="flex" alignItems="center" gap="4px">
      {label && (
        <Typography mr={0.5}>
          <b>{label}:</b>
        </Typography>
      )}
      {value}
    </Box>
  );
}

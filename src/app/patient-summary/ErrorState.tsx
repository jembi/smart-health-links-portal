import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Box, Typography, Button } from '@mui/material';
import React from 'react';

interface ErrorStateProps {
  message: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message }) => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      padding={2}
    >
      <ErrorOutlineIcon color="error" style={{ fontSize: 80 }} />
      <Typography variant="subtitle1" align="center" marginTop={2}>
        {message}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleRefresh}
        style={{ marginTop: 16 }}
      >
        Refresh Page
      </Button>
    </Box>
  );
};

export default ErrorState;

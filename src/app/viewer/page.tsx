'use client';
import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { TBundle } from '@/types/fhir.types';

import ErrorState from '../components/ErrorState';
import PatientSummary from '../components/PatientSummaryViewer/PatientSummary';
import PatientSummarySkeleton from '../components/PatientSummaryViewer/PatientSummarySkeleton';
import { useAuth } from '../context/AuthProvider';
import { apiViewer } from '../services/endpoints/viewer.class';

interface DecodedToken {
  label: string;
  url: string;
  flag: string;
}

export default function SHlinkViewer() {
  const { user, isAuthenticated } = useAuth();
  const [fhirBundle, setFhirBundle] = useState<TBundle | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenData, setTokenData] = useState<DecodedToken | null>(null);
  const [name, setName] = useState<string>(user?.name || ''); // Initialize recipient name with user.name
  const [passcode, setPasscode] = useState<string>('');
  const [nameError, setNameError] = useState(false);
  const [passcodeError, setPasscodeError] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    const ticket = hash.split('/')[1];
    if (ticket) {
      try {
        const decodedString = atob(ticket);
        const decoded: DecodedToken = JSON.parse(decodedString);
        setTokenData(decoded);
      } catch (error) {
        setError(
          `Invalid Ticket: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }
  }, []);

  const handleNameSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Reset error states
    setNameError(false);
    setPasscodeError(false);

    // Validate the form
    if (!name) {
      setNameError(true);
      return;
    }
    if (tokenData && tokenData.flag !== 'L' && !passcode) {
      setPasscodeError(true);
      return;
    }

    // Extract URL from tokenData
    const url = tokenData?.url;
    if (!url) {
      setError(
        'Invalid token data. Please ask the patient to generate a new valid link.',
      );
      return;
    }

    // Prepare the request body
    const requestBody: { recipient: string; passcode?: string } = {
      recipient: name,
    };

    if (tokenData?.flag !== 'L') {
      requestBody.passcode = passcode;
    }

    try {
      setLoading(true);
      // Send POST request using fetchShareLinkData
      const response = await apiViewer.fetchShareLinkData(url, requestBody);
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = response.data;

      // Check if files array is available and extract location
      if (responseData.files && responseData.files.length > 0) {
        const location = responseData.files[0].location;
        // Run GET request using the value of location as URL
        const fileResponse = await apiViewer.getShareLinkData(location);
        setFhirBundle(fileResponse.data);
      } else if (responseData.files && responseData.files.length === 0) {
        setError(
          'The SHlink has no files associated with it. Please ask the patient to generate a new valid link.',
        );
      }
    } catch (error) {
      setError(
        `Error submitting form: ${error instanceof Error ? error.message : String(error)}`,
      );
      if (axios.isAxiosError(error)) {
        // Handle Axios-specific errors
        if (error.response) {
          // Server responded with a status other than 200 range
          console.log(error.response);
          setError(
            `Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`,
          );
        } else if (error.request) {
          // Request was made but no response was received
          setError('Error: No response received from the server');
        } else {
          // Something happened in setting up the request
          setError(`Error: ${error.message}`);
        }
      } else {
        // Handle other types of errors
        setError('Error submitting form');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <PatientSummarySkeleton />;
  }

  if (!isAuthenticated) {
    return (
      <ErrorState message="You must log in or register to access the viewer." />
    );
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <Box>
      {!fhirBundle && (
        <Container maxWidth="sm">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            paddingTop={8}
            paddingBottom={8}
          >
            <Paper elevation={3} style={{ padding: '16px', width: '100%' }}>
              <Typography variant="h5">
                Request access to patient data
              </Typography>
              <Divider sx={{ my: 2 }} />
              <form onSubmit={handleNameSubmit}>
                <Stack spacing={2}>
                  <TextField
                    label="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={nameError}
                    helperText={nameError ? 'Name is required' : ''}
                    fullWidth
                    margin="normal"
                    required
                  />
                  {tokenData && tokenData.flag !== 'L' && (
                    <TextField
                      required
                      label="Enter the link passcode"
                      type="password"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      error={passcodeError}
                      helperText={passcodeError ? 'Passcode is required' : ''}
                      fullWidth
                      margin="normal"
                    />
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                    style={{ marginTop: '16px' }}
                  >
                    Submit
                  </Button>
                </Stack>
              </form>
            </Paper>
          </Box>
        </Container>
      )}
      <Container maxWidth={false}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          paddingTop={8}
          paddingBottom={8}
        >
          {fhirBundle && <PatientSummary fhirBundle={fhirBundle} />}
        </Box>
      </Container>
    </Box>
  );
}

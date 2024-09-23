'use client';
import { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import Box from '@mui/material/Box';
import { useAuth } from '../context/AuthProvider';
import { apiSharedLink } from '../utils/api.class';
import { TBundle } from '@/types/fhir.types';

import PatientSummary from './components/PatientSummary';
import PatientSummarySkeleton from './PatientSummarySkeleton';
import ErrorState from './ErrorState';

export default function PatientSummaryPage() {
  const { user, isAuthenticated } = useAuth();
  const [fhirBundle, setFhirBundle] = useState<TBundle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiSharedLink.getPatientData(user.id);
        setFhirBundle(response.data as TBundle);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user]);

  if (loading) {
    return <PatientSummarySkeleton />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
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
  );
}

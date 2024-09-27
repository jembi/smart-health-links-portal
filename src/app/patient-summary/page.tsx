'use client';
import { Container } from '@mui/material';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';

import { TBundle } from '@/types/fhir.types';

import PatientSummary from './components/PatientSummary';
import ErrorState from './ErrorState';
import PatientSummarySkeleton from './PatientSummarySkeleton';
import { useAuth } from '../context/AuthProvider';
import { apiIps } from '../services/endpoints/ips.class';

export default function PatientSummaryPage() {
  const { user, isAuthenticated } = useAuth();
  const [fhirBundle, setFhirBundle] = useState<TBundle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await apiIps.getPatientData(user.id);
        setFhirBundle(data);
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

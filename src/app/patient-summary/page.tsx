import { Container } from '@mui/material';
import Box from '@mui/material/Box';

import { TBundle } from '@/types/fhir.types';

import PatientSummary from './components/PatientSummary';
import fhirBundleJson from './sample/bundle.json';

export default function PatientSummaryPage() {
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
        <PatientSummary fhirBundle={fhirBundleJson as TBundle} />
      </Box>
    </Container>
  );
}

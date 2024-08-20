import Box from '@mui/material/Box';
import { Container, Typography } from "@mui/material";

import FhirBundleViewer from './components/FHIRBundleViewer'; // Adjust path as needed
import fhirBundleJson from './_sample/bundle.json'; // Your FHIR Bundle JSON

export default function PatientSummaryViewer() {
  return (
    <Container maxWidth={false}> 
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center"
        paddingTop={4}
        paddingBottom={4}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Patient Summary Viewer: Patient: John Snow
        </Typography>
        <FhirBundleViewer bundleData={fhirBundleJson} />
      </Box>
    </Container>
  );
}

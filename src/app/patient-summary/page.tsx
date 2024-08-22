import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import PatientSummary from "./components/PatientSummary";

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
        <PatientSummary />
      </Box>
    </Container>
  );
}

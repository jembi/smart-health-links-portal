import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { ArrayCaption } from "@/app/components/typography/ArrayCaption";

export default function PatientIdentifiers({ patientInfo }) {
  const identifierRows = patientInfo.identifier.map((patientIdentifier) => {
    return {
      identifier: patientIdentifier.value,
      system: patientIdentifier.system,
    };
  });

  return (
    <>
      <ArrayCaption caption="Patient Identifiers" />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell>Identifier</TableCell>
              <TableCell align="right">System</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {identifierRows.map((row) => (
              <TableRow key={row.identifier}>
                <TableCell>{row.identifier}</TableCell>
                <TableCell align="right">{row.system}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

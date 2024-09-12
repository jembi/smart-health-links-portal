import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';

import { ArrayCaption } from '@/app/components/typography/ArrayCaption';
import { IResourceType } from '@/types/fhir.types';

export default function MedicationDetails({
  medicationDetails,
}: {
  medicationDetails: IResourceType['Medication'];
}) {
  return (
    <TableContainer component={Paper}>
      <ArrayCaption caption="Medication Details" />
      <Table sx={{ minWidth: 650 }} size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Code</TableCell>
            <TableCell>Display</TableCell>
            <TableCell>System</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {medicationDetails.code?.coding?.map((code, index) => (
            <TableRow key={index}>
              <TableCell>Medication</TableCell>
              <TableCell>{code?.code}</TableCell>
              <TableCell>{code?.display}</TableCell>
              <TableCell>{code?.system}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

import { ArrayCaption } from '@/app/components/typography/ArrayCaption';
import { IResourceType } from '@/types/fhir.types';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

export default function ConditionDetails({
  conditionDetails,
}: {
  conditionDetails: IResourceType['Condition'];
}) {
  return (
    <TableContainer component={Paper}>
      <ArrayCaption caption="Condition Details" />
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
          {conditionDetails.clinicalStatus['coding'].map((code, index) => (
            <TableRow key={index}>
              <TableCell>Clinical Status</TableCell>
              <TableCell>{code.code}</TableCell>
              <TableCell>{code.display}</TableCell>
              <TableCell>{code.system}</TableCell>
            </TableRow>
          ))}
          {conditionDetails?.verificationStatus?.['coding'].map(
            (code, index) => (
              <TableRow key={index}>
                <TableCell>Verification Status</TableCell>
                <TableCell>{code.code}</TableCell>
                <TableCell>{code.display}</TableCell>
                <TableCell>{code.system}</TableCell>
              </TableRow>
            ),
          )}

          {conditionDetails.category?.map((category, index) =>
            category.coding.map((coding, idx) => (
              <TableRow key={idx}>
                <TableCell>Category</TableCell>
                <TableCell>{coding.code}</TableCell>
                <TableCell>{coding.display}</TableCell>
                <TableCell>{coding.system}</TableCell>
              </TableRow>
            )),
          )}

          {conditionDetails.severity?.coding?.map((coding, idx) => (
            <TableRow key={idx}>
              <TableCell>Severity</TableCell>
              <TableCell>{coding.code}</TableCell>
              <TableCell>{coding.display}</TableCell>
              <TableCell>{coding.system}</TableCell>
            </TableRow>
          ))}

          {conditionDetails.code?.coding?.map((coding, idx) => (
            <TableRow key={idx}>
              <TableCell>Code</TableCell>
              <TableCell>{coding.code}</TableCell>
              <TableCell>{coding.display}</TableCell>
              <TableCell>{coding.system}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

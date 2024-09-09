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

export default function QualificationDetails({
  qualificationDetails,
}: {
  qualificationDetails: IResourceType['Practitioner'];
}) {
  return (
    <>
      <ArrayCaption caption="Qualification" />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell>Qualification</TableCell>
              <TableCell align="right">System</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {qualificationDetails.map((qualificationDetail, index) => {
              const qualificationDetailCodes = qualificationDetail.code?.coding;
              return (
                <TableRow key={index}>
                  <TableCell>
                    {qualificationDetailCodes.map(
                      (coding) => `${coding?.code} (${coding?.display})`,
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {qualificationDetailCodes.map((coding) => coding?.system)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

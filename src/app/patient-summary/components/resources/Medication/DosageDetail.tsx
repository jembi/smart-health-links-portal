import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { Timing } from 'fhir/r4';

import { ArrayCaption } from '@/app/components/typography/ArrayCaption';
import { IResourceType } from '@/types/fhir.types';

const DOSAGE_UNITS = {
  s: 'second',
  min: 'minute',
  h: 'hour',
  d: 'day',
  wk: 'week',
  mo: 'month',
  a: '',
};

export default function DosageDetails({
  dosageDetails,
}: {
  dosageDetails: IResourceType['MedicationStatement']['dosage'];
}) {
  const formatDosageUnit = (timing: Timing) => {
    const repeatCount = timing?.repeat?.count || '';
    const repeatPeriod = timing?.repeat?.period || '';
    const repeatCountSeparator = repeatCount ? '/' : '';
    const periodUnit = DOSAGE_UNITS[timing?.repeat?.periodUnit] || '';
    const periodSuffix = repeatPeriod ? 's' : '';
    return `${repeatCount} ${repeatPeriod} ${repeatCountSeparator} ${periodUnit}${periodSuffix}`;
  };

  return (
    <TableContainer component={Paper}>
      <ArrayCaption caption="Dosage" />
      <Table sx={{ minWidth: 650 }} size="small">
        <TableHead>
          <TableRow>
            <TableCell>Quantity</TableCell>
            <TableCell>Dosage</TableCell>
            <TableCell>Usage</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dosageDetails.map(({ doseAndRate, timing, route }, index) => (
            <TableRow key={index}>
              <TableCell>
                {doseAndRate?.map(
                  ({ doseQuantity }) =>
                    `${doseQuantity?.value ?? ''} ${doseQuantity?.unit ?? ''}`,
                )}
              </TableCell>
              <TableCell>
                {timing?.repeat && formatDosageUnit(timing)}
              </TableCell>
              <TableCell>
                {route?.coding?.map(({ display }) => display || '')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

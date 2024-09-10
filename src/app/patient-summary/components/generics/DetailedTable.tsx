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

import { tableConfig } from './resource.types';

export const DetailedTable = <T extends IResourceType[keyof IResourceType]>({
  title,
  columns,
  customFields,
  resource,
  renderRows,
}: Omit<tableConfig<T>, 'resource'> & { resource: T }) => (
  <TableContainer component={Paper}>
    <ArrayCaption caption={title} />
    <Table sx={{ minWidth: 650 }} size="small">
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <TableCell key={column}>{column}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>{renderRows({ customFields, row: resource })}</TableBody>
    </Table>
  </TableContainer>
);

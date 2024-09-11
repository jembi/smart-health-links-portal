import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  styled,
} from '@mui/material';

import { ArrayCaption } from '@/app/components/typography/ArrayCaption';
import { IResourceType } from '@/types/fhir.types';

import { tableConfig } from './resource.types';

export const StyledTableRow = styled(TableRow)(() => ({}));

export const StyledTableCell = styled(TableCell, {
  shouldForwardProp: (prop) => prop !== 'cellNumber',
})(({ cellNumber }: { cellNumber: number }) => ({
  width: `${100 / cellNumber}%`,
}));

export const DetailedTable = <T extends IResourceType[keyof IResourceType]>({
  title,
  columns,
  resource: row,
  renderRow,
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
      <TableBody>
        {renderRow({
          row,
          StyledTableRow: (props) => <StyledTableRow {...props} />,
          StyledTableCell: (props) => (
            <StyledTableCell {...props} cellNumber={columns.length} />
          ),
        })}
      </TableBody>
    </Table>
  </TableContainer>
);

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  styled,
  Typography,
} from '@mui/material';

import { TSupportedResource } from '@/types/fhir.types';

export const StyledTableRow = styled(TableRow)(() => ({}));

export const StyledTableCell = styled(TableCell, {
  shouldForwardProp: (prop) => prop !== 'cellNumber',
})(({ cellNumber }: { cellNumber: number }) => ({
  width: `${100 / (cellNumber || 1)}%`,
  border: '1px solid #eee',
}));

export const DetailedTable = <T extends TSupportedResource>({
  data,
  title,
}: {
  data: {
    rows: string | string[] | JSX.Element[] | JSX.Element[][];
    columns: string[];
  };
  title: string;
}) => {
  return (Array.isArray(data.rows) ? data.rows : [data.rows])?.filter(
    (row) => !!row,
  ).length ? (
    <>
      {title ? <Typography fontWeight={700}>{title}:</Typography> : null}
      <Table
        sx={{
          minWidth: 650,
          mt: '5px',
          border: '1px solid #eee',
        }}
        size="small"
      >
        <TableHead>
          <TableRow>
            {data.columns.map((column) => (
              <TableCell
                key={column}
                sx={{
                  bgcolor: '#f8f8f8',
                  border: '1px solid #ddda',
                  fontWeight: 700,
                }}
              >
                {column}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>{data.rows}</TableBody>
      </Table>
    </>
  ) : null;
};

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  styled,
  Typography,
} from '@mui/material';
import { JSX } from 'react';

export const StyledTableRow = styled(TableRow)(() => ({
  '&:hover': {
    backgroundColor: ' #fafafa',
  },
}));

export const StyledTableCell = styled(TableCell, {
  shouldForwardProp: (prop) => prop !== 'cellNumber',
})(({ cellNumber }: { cellNumber: number }) => ({
  width: `${100 / (cellNumber || 1)}%`,
  border: '1px solid #eee',
}));

export const DetailedTable = ({
  data,
  title,
}: {
  data: {
    rows: string | string[] | JSX.Element[] | JSX.Element[][];
    columns: string[];
  };
  title?: string;
}) => {
  return (Array.isArray(data.rows)
    ? data.rows.filter((row) => {
        if (Array.isArray(row) && row.length === 0) return false;
        return true;
      })
    : [data.rows]
  )?.filter((row) => !!row).length ? (
    <>
      {title && <Typography fontWeight={700}>{title}:</Typography>}
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
                  padding: '4px 16px',
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

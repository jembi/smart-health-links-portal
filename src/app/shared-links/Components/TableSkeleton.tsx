import { Skeleton } from '@mui/material';
import { TableBody, TableCell, TableRow } from '@mui/material';
import React from 'react';

const TableSkeleton: React.FC = () => {
  const rows = Array.from({ length: 5 });
  const columns = Array.from({ length: 3 });

  return (
    <TableBody>
      {rows.map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {columns.map((_, colIndex) => (
            <TableCell key={colIndex}>
              <Skeleton variant="text" height={40} animation="wave" />
            </TableCell>
          ))}
          <TableCell>
            <Skeleton variant="text" height={40} animation="wave" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default TableSkeleton;

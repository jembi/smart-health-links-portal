'use client';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import React from 'react';

import { SHLinkMiniDto } from '@/domain/dtos/shlink';

import BooleanIcon from './BooleanIcon';

interface Column {
  id: keyof SHLinkMiniDto;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  // string | boolean | Date | SHLinkFileDto[]
  format?: (
    value: SHLinkMiniDto[keyof SHLinkMiniDto],
  ) => string | React.JSX.Element;
}

const columns: readonly Column[] = [
  { id: 'name', label: 'Name', minWidth: 100 },
  {
    id: 'expiryDate',
    label: 'Expiry Date',
    minWidth: 80,
    format: (value?: Date) =>
      value?.toLocaleDateString() || (
        <span
          style={{ display: 'flex', alignItems: 'center', color: '#9e9e9e' }}
        >
          <CalendarTodayIcon fontSize="small" style={{ marginRight: '4px' }} />
          Not Defined
        </span>
      ),
  },
  {
    id: 'passwordRequired',
    label: 'Passcode enabled',
    minWidth: 50,
    format: (value?: boolean) => <BooleanIcon status={!!value} />,
  },
];

function createData(data: SHLinkMiniDto): SHLinkMiniDto {
  return { ...data };
}

const apiDataMock: SHLinkMiniDto[] = [
  {
    name: 'Lab Results',
    id: 'A9876',
    managementToken: 'token-health1234abcd5678',
    url: 'https://healthportal.com/share/johndoe/lab-results',
    expiryDate: new Date('2024-11-01T09:30:00Z'),
    passwordRequired: true,
  },
  {
    name: 'MRI Report',
    id: 'B6543',
    managementToken: 'token-mri5678wxyz9012',
    url: 'https://healthportal.com/share/janesmith/mri-report',
    passwordRequired: false,
  },
  {
    name: 'Prescription',
    id: 'C3210',
    managementToken: 'token-prescript123uvwx4567',
    url: 'https://healthportal.com/share/patient/prescription-link',
    expiryDate: new Date('2025-01-15T12:00:00Z'),
    passwordRequired: true,
  },
  {
    name: 'Surgery Notes',
    id: 'D7891',
    managementToken: 'token-surgery789abcd0123',
    url: 'https://healthportal.com/share/emilybrown/surgery-notes',
    expiryDate: new Date('2024-09-30T15:00:00Z'),
    passwordRequired: false,
  },
];

const rows = apiDataMock.map(createData);

export default function LinksTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: '50vh' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow hover tabIndex={-1} key={row.id}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format
                          ? column.format(value)
                          : value.toString()}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

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
import axios from 'axios';
import { useEffect, useState } from 'react';

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
      value?.toString() || (
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

export default function LinksTable({
  session,
}: {
  session: { user: { id: string } };
}) {
  const [links, setLinks] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    async function fetchPosts() {
      const id = session.user.id;
      return axios
        .get(`http://localhost:3000/api/v1/share-links?user_id=${id}`)
        .then((response) => {
          setLinks(response.data);
        });
    }
    fetchPosts();
  }, []);

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
            {links
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
        count={links.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

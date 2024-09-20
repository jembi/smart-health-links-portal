'use client';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import {
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import { useEffect, useState } from 'react';
import React from 'react';

import { useSession } from '@/app/hooks/useSession';
import { apiClient } from '@/app/utils/api.class';
import { SHLinkMiniDto } from '@/domain/dtos/shlink';

import { AddLinkDialog } from './AddLinkDialog';
import BooleanIcon from './BooleanIcon';

interface Column {
  id: keyof SHLinkMiniDto;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
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
      value?.toString()?.substring(0, 10) || (
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

const fetchLinks = async (id: string) =>
  apiClient.find({
    url: `/share-links?user_id=${id}`,
  });

export default function LinksTable() {
  const session = useSession();
  const [links, setLinks] = useState<SHLinkMiniDto[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [addDialog, setAddDialog] = React.useState<boolean>();

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    if (session?.user?.id)
      fetchLinks(session.user.id).then(({ data }) => setLinks(data));
  }, [session?.user?.id]);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  const handleCreateLink = (_event: unknown) => {
    setAddDialog(true);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <AddLinkDialog
        open={addDialog}
        onClose={() => setAddDialog(false)}
        callback={() => {
          if (session?.user?.id)
            fetchLinks(session.user.id).then((response) =>
              setLinks(response.data),
            );
        }}
      />
      <Grid container justifyContent="end">
        <Grid item>
          <Button variant="contained" onClick={handleCreateLink}>
            Add new link
          </Button>
        </Grid>
      </Grid>
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
                          : value?.toString()}
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

'use client';

import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LinkOffIcon from '@mui/icons-material/LinkOff';
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
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useEffect, useState } from 'react';
import React from 'react';

import { apiSharedLink } from '@/app/utils/api.class';
import { SHLinkMiniDto } from '@/domain/dtos/shlink';

import { AddLinkDialog } from './AddLinkDialog';
import BooleanIcon from './BooleanIcon';
import ConfirmationDialog from './ConfirmationDialog';

interface Column {
  id: keyof SHLinkMiniDto;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (
    value: SHLinkMiniDto[keyof SHLinkMiniDto],
  ) => string | React.JSX.Element;
}

interface IActionColumn extends Omit<Column, 'id' | 'label'> {
  id: 'action';
  label: React.JSX.Element;
  action: (id: string) => void;
}

const createActionColumn = (
  label: React.JSX.Element,
  action: (id: string) => void,
): IActionColumn => ({
  id: 'action',
  label,
  minWidth: 50,
  action,
});

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

export default function LinksTable() {
  const [links, setLinks] = useState<SHLinkMiniDto[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [addDialog, setAddDialog] = React.useState<boolean>();
  const [refetch, setRefetch] = useState(false);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleDeactivate = async (id: string) => {
    setSelectedLinkId(id);
    setConfirmDialogOpen(true);
  };

  const confirmDeactivate = async () => {
    if (selectedLinkId) {
      try {
        await apiSharedLink.deactivateLink(selectedLinkId);
        setRefetch(true);
        setConfirmDialogOpen(false);
      } catch (error) {
        console.error('Failed to deactivate link:', error);
      }
    }
  };

  const actionColumn: IActionColumn[] = [
    createActionColumn(<LinkOffIcon />, handleDeactivate),
    // TODO: Other actions will be added
  ];

  const fetchLinks = async () => {
    const { data } = await apiSharedLink.findLinks();
    setLinks(data);
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  const handleCreateLink = (_event: unknown) => {
    setAddDialog(true);
  };

  const combinedCols = [...columns, ...actionColumn];

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <AddLinkDialog
        open={addDialog}
        onClose={() => setAddDialog(false)}
        callback={() => {
          apiSharedLink.findLinks().then(({ data }) => {
            setLinks(data);
            setAddDialog(false);
          });
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
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {links
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow hover tabIndex={-1} key={row.id}>
                  {combinedCols.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell
                        key={column.id + row.active}
                        align={column.align}
                      >
                        {column.id === 'action' ? (
                          <Tooltip title="Deactivate">
                            <span>
                              <Button
                                disabled={!row.active}
                                onClick={() => column.action(row.id)}
                              >
                                {column.label}
                              </Button>
                            </span>
                          </Tooltip>
                        ) : column.format ? (
                          column.format(value)
                        ) : (
                          value?.toString()
                        )}
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

      <ConfirmationDialog
        confirmDeactivate={confirmDeactivate}
        confirmDialogOpen={confirmDialogOpen}
        setConfirmDialogOpen={setConfirmDialogOpen}
      />
    </Paper>
  );
}

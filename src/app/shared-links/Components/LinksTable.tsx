'use client';
import { Cancel, CheckCircle, ContentCopy, QrCode } from '@mui/icons-material';
import { Add } from '@mui/icons-material';
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
} from '@mui/material';
import { green, red } from '@mui/material/colors';
import { useEffect, useState } from 'react';
import React from 'react';

import { StyledButton } from '@/app/components/StyledButton';
import { apiSharedLink } from '@/app/services/endpoints/share-link.class';
import { clipboard, uuid } from '@/app/utils/helpers';
import { type SHLinkMiniDto } from '@/domain/dtos/shlink';

import { AddLinkDialog } from './dialogs/AddLinkDialog';
import ConfirmationDialog from './dialogs/ConfirmationDialog';
import { QRCodeDialog } from './dialogs/QRCodeDialog';

interface Column {
  id: keyof SHLinkMiniDto;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (
    value: SHLinkMiniDto[keyof SHLinkMiniDto],
  ) => string | React.JSX.Element;
}

interface IActionColumns extends Omit<Column, 'id' | 'label'> {
  id: 'action';
  label: React.JSX.Element;
  action: (row: SHLinkMiniDto) => void;
  tooltipTitle?: string;
  isDisabled?: (row: SHLinkMiniDto) => boolean;
}

const createActionColumn = (
  label: React.JSX.Element,
  action: (row: SHLinkMiniDto) => void,
  tooltipTitle?: string,
  isDisabled?: (row: SHLinkMiniDto) => boolean,
): IActionColumns => ({
  id: 'action',
  label,
  minWidth: 50,
  action,
  tooltipTitle,
  isDisabled,
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
    format: (value?: boolean) =>
      !!value ? (
        <CheckCircle style={{ color: green[500] }} />
      ) : (
        <Cancel style={{ color: red[500] }} />
      ),
  },
];

const handleCopyLink = async ({ url }: SHLinkMiniDto) => {
  await clipboard(url);
};

export default function LinksTable() {
  const [links, setLinks] = useState<SHLinkMiniDto[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [addDialog, setAddDialog] = React.useState<boolean>();
  const [refetch, setRefetch] = useState(false);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);

  const [qrCodeDialogOpen, setQrCodeDialogOpen] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<{
    id: string;
    managementToken: string;
    url: string;
  }>();

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleDeactivate = (row: SHLinkMiniDto) => {
    setSelectedLinkId(row.id);
    setConfirmDialogOpen(true);
  };

  const confirmDeactivate = async () => {
    if (selectedLinkId) {
      try {
        await apiSharedLink.deactivateLink(selectedLinkId);
        setRefetch(!refetch);
        setConfirmDialogOpen(false);
      } catch (error) {
        console.error('Failed to deactivate link:', error);
      }
    }
  };
  const handleQrCode = ({ id, url, managementToken }: SHLinkMiniDto) => {
    setQrCodeDialogOpen(true);
    setQrCodeData({ id, url, managementToken });
  };

  const actionColumns: IActionColumns[] = [
    createActionColumn(
      <LinkOffIcon />,
      handleDeactivate,
      'Deactivate',
      ({ active }) => !active,
    ),
    createActionColumn(<QrCode />, handleQrCode, 'Show QR Code'),
    createActionColumn(<ContentCopy />, handleCopyLink, 'Copy Shared Link'),
  ];

  const fetchLinks = async () => {
    const { data } = await apiSharedLink.findLinks();
    setLinks(data);
  };

  useEffect(() => {
    fetchLinks();
  }, [refetch]);

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
    <Paper sx={{ width: '100%', overflow: 'hidden', marginBottom: '25px' }}>
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
      {qrCodeDialogOpen && (
        <QRCodeDialog
          open={qrCodeDialogOpen}
          data={qrCodeData}
          onClose={() => {
            setQrCodeDialogOpen(false);
          }}
        />
      )}
      <Grid container justifyContent="end">
        <Grid item>
          <StyledButton
            size="small"
            variant="contained"
            onClick={handleCreateLink}
          >
            <Add
              sx={{ color: '#eee', paddingRight: '4px', marginRight: '4px' }}
            />
            new link
          </StyledButton>
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
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell
                        key={column.id + row.active}
                        align={column.align}
                      >
                        {column.format
                          ? column.format(value)
                          : value?.toString()}
                      </TableCell>
                    );
                  })}
                  <TableCell width={250}>
                    {actionColumns.map((actionColumn) => (
                      <Tooltip key={uuid()} title={actionColumn.tooltipTitle}>
                        <span>
                          <Button
                            disabled={actionColumn.isDisabled?.(row)}
                            onClick={() => actionColumn.action(row)}
                          >
                            {actionColumn.label}
                          </Button>
                        </span>
                      </Tooltip>
                    ))}
                  </TableCell>
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

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

export const ConfirmationDialog = ({
  confirmDeactivate,
  confirmDialogOpen,
  setConfirmDialogOpen,
}: {
  confirmDeactivate: () => void;
  confirmDialogOpen: boolean;
  setConfirmDialogOpen: (arg: boolean) => void;
}) => {
  return (
    <Dialog
      open={confirmDialogOpen}
      onClose={() => setConfirmDialogOpen(false)}
    >
      <DialogTitle>Confirm Deactivation</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to deactivate this link? Deactivating will
          permanently disable the link, and you will need to create a new one.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
        <Button onClick={confirmDeactivate} color="error" variant="contained">
          Deactivate
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;

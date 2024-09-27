import { Block, KeyboardBackspace } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
} from '@mui/material';

import { StyledDialogActions } from '@/app/components/StyledDialogActions';
import { StyledDialogTitle } from '@/app/components/StyledDialogTitle';

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
      <StyledDialogTitle>Confirm Deactivation</StyledDialogTitle>
      <DialogContent style={{ padding: '20px 25px' }}>
        <DialogContentText>
          Are you sure you want to deactivate this link? Deactivating will
          permanently disable the link, and you will need to create a new one.
        </DialogContentText>
      </DialogContent>
      <StyledDialogActions>
        <Button onClick={() => setConfirmDialogOpen(false)}>
          <KeyboardBackspace sx={{ paddingRight: '4px', marginRight: '4px' }} />
          Cancel
        </Button>
        <Button
          onClick={confirmDeactivate}
          color="error"
          variant="contained"
          sx={{
            backgroundImage:
              'linear-gradient(to bottom, hsla(0, 0%, 90%, .05), #0004)',
          }}
        >
          <Block sx={{ paddingRight: '4px', marginRight: '4px' }} />
          Deactivate
        </Button>
      </StyledDialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;

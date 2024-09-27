import { Block, KeyboardBackspace } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
} from '@mui/material';

import { StyledButton } from '@/app/components/StyledButton';
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
        <StyledButton
          onClick={confirmDeactivate}
          color="error"
          variant="contained"
        >
          <Block sx={{ paddingRight: '4px', marginRight: '4px' }} />
          Deactivate
        </StyledButton>
      </StyledDialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;

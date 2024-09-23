import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { green, red } from '@mui/material/colors';

export default function BooleanIcon({
  status,
}: {
  status: boolean;
}): JSX.Element {
  return status ? (
    <CheckCircleIcon style={{ color: green[500] }} />
  ) : (
    <CancelIcon style={{ color: red[500] }} />
  );
}

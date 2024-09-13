import { styled, Typography } from '@mui/material';

export const StyledSectionTypography = styled(Typography)(({ theme }) => ({
  backgroundImage: 'linear-gradient(270deg, hsla(0, 0%, 86.3%, .05), #e6e6e6)',
  marginBlock: '.62rem',
  fontWeight: 700,
  fontSize: '1.1em',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: '100%',
  },
  [theme.breakpoints.down('sm')]: {
    width: 'auto',
  },
}));

export const StyledTableCaptionTypography = styled(Typography)({
  marginRight: '.03rem',
});

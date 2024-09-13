import { StyledTableCaptionTypography } from './StyledTypography';

export const ArrayCaption = ({ caption }) => {
  return (
    <StyledTableCaptionTypography>
      <b>{caption}: </b>
    </StyledTableCaptionTypography>
  );
};

import { Box, Container, Typography } from "@mui/material";

export default function NotFound() {
  return (
    <Container maxWidth={false}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        paddingTop={8}
        paddingBottom={8}
      >
        <Typography variant="h2" align="center" gutterBottom>
          4 0 4
        </Typography>
        <Typography variant="h4" align="center" gutterBottom>
          The page you are looking for could not be found
        </Typography>
      </Box>
    </Container>
  );
}

'use server';
import { Box, Container } from '@mui/material';

import LinksTable from './Components/LinksTable';

export default async function SharedLinksPage() {
  return (
    <Container maxWidth={false}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        paddingTop={8}
        paddingBottom={8}
      ></Box>
      <LinksTable />
    </Container>
  );
}

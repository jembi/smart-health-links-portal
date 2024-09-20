import { Box, Container } from '@mui/material';
import { getServerSession } from 'next-auth';

import LinksTable from './Components/LinksTable';
import { authOptions } from '../api/auth/authOptions';

export default async function SharedLinksPage() {
  const session: { user: { id: string } } = await getServerSession(authOptions);
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
      <LinksTable session={session} />
    </Container>
  );
}

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Skeleton from '@mui/material/Skeleton';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import * as React from 'react';

export default function PatientSummarySkeleton() {
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
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={0} variant="scrollable" scrollButtons="auto">
              <Tab label={<Skeleton width={100} />} />
              <Tab label={<Skeleton width={100} />} />
              <Tab label={<Skeleton width={100} />} />
            </Tabs>
          </Box>
          <Box sx={{ padding: 2 }}>
            <Skeleton variant="rectangular" width="100%" height={400} />
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

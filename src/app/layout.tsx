import { Grid } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';

import { authOptions } from './api/auth/authOptions';
import Footer from './components/Footer';
import Header from './components/Header';
import AuthProvider from './context/AuthProvider';
import theme from './theme';

import './globals.css';

export const metadata: Metadata = {
  title: 'SHLinks',
  description:
    'patient-centric solution for managing and sharing encrypted health records, offering granular control over data access to trusted clinicians',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <AuthProvider session={session}>
              <Header />
              <Grid
                sx={{ alignContent: 'center' }}
                minHeight={'calc(100vh - 137px)'}
              >
                {children}
              </Grid>
              <Footer />
            </AuthProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

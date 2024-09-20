import { ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import type { Metadata } from 'next';

import Footer from './components/Footer';
import Header from './components/Header';
import theme from './theme';
import './globals.css';

export const metadata: Metadata = {
  title: 'SHLinks',
  description:
    'patient-centric solution for managing and sharing encrypted health records, offering granular control over data access to trusted clinicians',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <Header />
            {children}
            <Footer />
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

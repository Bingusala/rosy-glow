import React, { ReactNode } from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {children}
      </Container>
      
      {/* Footer */}
      <Box
        component="footer"
        sx={{
          backgroundColor: '#333',
          color: 'white',
          py: 4,
          mt: 'auto',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" align="center">
            © 2025 Rosy Glow Cosmetics. All rights reserved.
          </Typography>
          <Typography variant="body2" align="center" sx={{ mt: 1, color: 'grey.400' }}>
            Your beauty, our passion 💄✨
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
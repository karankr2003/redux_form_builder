'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as PreviewIcon,
  List as ListIcon,
} from '@mui/icons-material';

const Navigation: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { label: 'Create Form', path: '/create', icon: <AddIcon /> },
    { label: 'Preview', path: '/preview', icon: <PreviewIcon /> },
    { label: 'My Forms', path: '/myforms', icon: <ListIcon /> },
  ];

  return (
    <AppBar position="static" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => router.push('/')}
          >
            Redux Form Builder
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                startIcon={item.icon}
                onClick={() => router.push(item.path)}
                variant={pathname === item.path ? 'outlined' : 'text'}
                sx={{
                  borderColor: pathname === item.path ? 'rgba(255, 255, 255, 0.5)' : 'transparent',
                  color: 'white',
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;


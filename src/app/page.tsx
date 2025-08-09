'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as PreviewIcon,
  List as ListIcon,
} from '@mui/icons-material';
import Navigation from '@/components/Navigation';

export default function Home() {
  const router = useRouter();

  const features = [
    {
      title: 'Create Forms',
      description: 'Build dynamic forms with customizable fields and validation rules',
      icon: <AddIcon sx={{ fontSize: 48 }} />,
      path: '/create',
      color: '#1976d2',
    },
    {
      title: 'Preview Forms',
      description: 'See how your forms behave for end users with real-time validation',
      icon: <PreviewIcon sx={{ fontSize: 48 }} />,
      path: '/preview',
      color: '#388e3c',
    },
    {
      title: 'Manage Forms',
      description: 'View and organize all your saved forms in one place',
      icon: <ListIcon sx={{ fontSize: 48 }} />,
      path: '/myforms',
      color: '#f57c00',
    },
  ];

  return (
    <>
      <Navigation />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h2" component="h1" gutterBottom>
            Redux Form Builder
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            Create dynamic, validated forms with ease using React, Redux, and TypeScript
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature) => (
            <Grid item xs={12} md={4} key={feature.title}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
                onClick={() => router.push(feature.path)}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                  <Box sx={{ color: feature.color, mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary" paragraph>
                    {feature.description}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 'auto', bgcolor: feature.color }}
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(feature.path);
                    }}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box textAlign="center" mt={8}>
          <Typography variant="h6" gutterBottom>
            Features
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                7 Field Types
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Custom Validation
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Derived Fields
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Local Storage
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}

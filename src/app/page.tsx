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

        {/* Features Section */}
        <Box sx={{ mt: 15  , textAlign: 'center' }}>
          <Typography variant="subtitle1" component="h2" sx={{ mb: 1, fontWeight: 'medium' }}>
            Key Features
          </Typography>
          <Grid container spacing={0.5} justifyContent="center" sx={{ maxWidth: '800px', mx: 'auto' }}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ px: 0.5, height: '100%' }}>
                <Typography variant="subtitle2" color="primary" sx={{ mb: 0 }}>
                  7+ Field Types
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2, display: 'block' }}>
                  Text, Number, Textarea, Select, Radio, Checkbox, Date
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ px: 0.5, height: '100%' }}>
                <Typography variant="subtitle2" color="primary" sx={{ mb: 0 }}>
                  Custom Validation
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2, display: 'block' }}>
                  Custom validation rules and error messages
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ px: 0.5, height: '100%' }}>
                <Typography variant="subtitle2" color="primary" sx={{ mb: 0 }}>
                  Derived Fields
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2, display: 'block' }}>
                  Calculate fields based on other fields
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ px: 0.5, height: '100%' }}>
                <Typography variant="subtitle2" color="primary" sx={{ mb: 0 }}>
                  Local Storage
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2, display: 'block' }}>
                  Save and load forms in browser
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}

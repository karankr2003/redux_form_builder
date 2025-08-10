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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          {features.map((feature) => (
            <div key={feature.title}>
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
            </div>
          ))}
        </div>

        {/* Features Section */}
        <Box sx={{ mt: 10, textAlign: 'center' }}>
          <Typography variant="subtitle1" component="h2" sx={{ mb: 4, fontWeight: 'medium' }}>
            Key Features
          </Typography>
          <Box sx={{ 
            display: 'flex',
            flexWrap: 'nowrap',
            justifyContent: 'center',
            gap: 3,
            overflowX: 'auto',
            maxWidth: '100%',
            px: 2,
            '& > *': {
              flex: '0 0 auto',
              minWidth: '200px',
              textAlign: 'center',
              p: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              backgroundColor: 'background.paper'
            }
          }}>
            <Box>
              <Typography variant="subtitle2" color="primary" sx={{ mb: 0.5, fontWeight: 'medium' }}>
                7+ Field Types
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2, display: 'block' }}>
                Text, Number, Textarea, Select, Radio, Checkbox, Date
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="primary" sx={{ mb: 0.5, fontWeight: 'medium' }}>
                Custom Validation
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2, display: 'block' }}>
                Custom validation rules and error messages
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="primary" sx={{ mb: 0.5, fontWeight: 'medium' }}>
                Derived Fields
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2, display: 'block' }}>
                Calculate fields based on other fields
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="primary" sx={{ mb: 0.5, fontWeight: 'medium' }}>
                Local Storage
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2, display: 'block' }}>
                Save and load forms in browser
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
}

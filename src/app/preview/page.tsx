'use client';

import React from 'react';
import { Container } from '@mui/material';
import Navigation from '@/components/Navigation';
import FormPreview from '@/components/form-preview/FormPreview';

export default function PreviewPage() {
  return (
    <>
      <Navigation />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <FormPreview />
      </Container>
    </>
  );
}

'use client';

import React from 'react';
import { Container } from '@mui/material';
import Navigation from '@/components/Navigation';
import FormBuilder from '@/components/form-builder/FormBuilder';

export default function CreatePage() {
  return (
    <>
      <Navigation />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <FormBuilder />
      </Container>
    </>
  );
}

'use client';

import React from 'react';
import { Container } from '@mui/material';
import Navigation from '@/components/Navigation';
import SavedFormsList from '@/components/saved-forms/SavedFormsList';

export default function MyFormsPage() {
  return (
    <>
      <Navigation />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <SavedFormsList />
      </Container>
    </>
  );
}

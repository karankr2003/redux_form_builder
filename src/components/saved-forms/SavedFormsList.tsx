'use client';

import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Stack,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Visibility as PreviewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  DateRange as DateIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  loadSavedForms,
  loadFormForPreview,
  clearCurrentForm,
} from '@/store/slices/formBuilderSlice';
import { FormSchema } from '@/types/form';

const SavedFormsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { savedForms } = useAppSelector(state => state.formBuilder);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    form: FormSchema | null;
  }>({ open: false, form: null });

  useEffect(() => {
    dispatch(loadSavedForms());
  }, [dispatch]);

  const handlePreviewForm = (form: FormSchema) => {
    dispatch(loadFormForPreview(form.id));
    router.push('/preview');
  };

  const handleEditForm = (form: FormSchema) => {
    dispatch(loadFormForPreview(form.id));
    router.push('/create');
  };

  const handleDeleteForm = (form: FormSchema) => {
    setDeleteDialog({ open: true, form });
  };

  const confirmDeleteForm = () => {
    if (deleteDialog.form) {
      // Remove from localStorage
      const updatedForms = savedForms.filter(f => f.id !== deleteDialog.form!.id);
      localStorage.setItem('savedForms', JSON.stringify(updatedForms));
      
      // Reload forms from localStorage
      dispatch(loadSavedForms());
    }
    setDeleteDialog({ open: false, form: null });
  };

  const handleCreateNewForm = () => {
    dispatch(clearCurrentForm());
    router.push('/create');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFieldTypeStats = (form: FormSchema) => {
    const fieldTypes = form.fields.map(field => field.type);
    const typeCount = fieldTypes.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(typeCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([type, count]) => `${count} ${type}${count > 1 ? 's' : ''}`)
      .join(', ');
  };

  const getDerivedFieldsCount = (form: FormSchema) => {
    return form.fields.filter(field => field.derivedConfig?.isDerived).length;
  };

  const getValidationRulesCount = (form: FormSchema) => {
    return form.fields.reduce((total, field) => total + field.validationRules.length, 0);
  };

  if (savedForms.length === 0) {
    return (
      <Box>
        <Box mb={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            My Forms
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your saved forms
          </Typography>
        </Box>

        <Card variant="outlined">
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No saved forms yet
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Create your first form to get started
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateNewForm}
              size="large"
            >
              Create New Form
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box mb={4}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">
            My Forms
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateNewForm}
          >
            Create New Form
          </Button>
        </Stack>
        
        <Alert severity="info" sx={{ mb: 2 }}>
          You have {savedForms.length} saved form{savedForms.length !== 1 ? 's' : ''}
        </Alert>
      </Box>

      {/* Forms Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '24px',
        width: '100%',
        padding: '16px'
      }}>
        {[...savedForms]
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .map((form) => (
            <div key={form.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom noWrap>
                    {form.name}
                  </Typography>
                  
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <DateIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                        Created: {formatDate(form.createdAt)}
                      </Typography>
                      {form.updatedAt !== form.createdAt && (
                        <Typography variant="body2" color="text.secondary">
                          Updated: {formatDate(form.updatedAt)}
                        </Typography>
                      )}
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Fields: {form.fields.length}
                      </Typography>
                      {form.fields.length > 0 && (
                        <Typography variant="caption" color="text.secondary">
                          {getFieldTypeStats(form)}
                        </Typography>
                      )}
                    </Box>

                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Chip
                        label={`${form.fields.length} fields`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      
                      {getValidationRulesCount(form) > 0 && (
                        <Chip
                          label={`${getValidationRulesCount(form)} validations`}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      )}
                      
                      {getDerivedFieldsCount(form) > 0 && (
                        <Chip
                          label={`${getDerivedFieldsCount(form)} derived`}
                          size="small"
                          color="info"
                          variant="outlined"
                        />
                      )}
                    </Stack>
                  </Stack>
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      startIcon={<PreviewIcon />}
                      onClick={() => handlePreviewForm(form)}
                      variant="outlined"
                    >
                      Preview
                    </Button>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditForm(form)}
                      variant="outlined"
                      color="secondary"
                    >
                      Edit
                    </Button>
                  </Stack>
                  
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteForm(form)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </div>
          ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, form: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Form</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the form "{deleteDialog.form?.name}"? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, form: null })}>
            Cancel
          </Button>
          <Button onClick={confirmDeleteForm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SavedFormsList;


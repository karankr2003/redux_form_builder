'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  Save as SaveIcon,
  Visibility as PreviewIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  addField,
  updateField,
  deleteField,
  reorderFields,
  setFormName,
  saveForm,
  clearCurrentForm,
  loadSavedForms,
} from '@/store/slices/formBuilderSlice';
import { FormField } from '@/types/form';
import FieldEditor from './FieldEditor';

const FormBuilder: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { currentForm } = useAppSelector(state => state.formBuilder);
  
  const [showFieldEditor, setShowFieldEditor] = useState(false);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveFormName, setSaveFormName] = useState(currentForm.name);

  useEffect(() => {
    dispatch(loadSavedForms());
  }, [dispatch]);

  const handleAddField = () => {
    setEditingField(null);
    setShowFieldEditor(true);
  };

  const handleEditField = (field: FormField) => {
    setEditingField(field);
    setShowFieldEditor(true);
  };

  const handleSaveField = (fieldData: Omit<FormField, 'id' | 'order'>) => {
    if (editingField) {
      dispatch(updateField({
        id: editingField.id,
        updates: fieldData,
      }));
    } else {
      dispatch(addField(fieldData));
    }
    setShowFieldEditor(false);
    setEditingField(null);
  };

  const handleCancelFieldEdit = () => {
    setShowFieldEditor(false);
    setEditingField(null);
  };

  const handleDeleteField = (fieldId: string) => {
    if (window.confirm('Are you sure you want to delete this field?')) {
      dispatch(deleteField(fieldId));
    }
  };

  const handleSaveForm = () => {
    if (!saveFormName.trim()) {
      alert('Please enter a form name');
      return;
    }
    
    dispatch(setFormName(saveFormName));
    dispatch(saveForm());
    setShowSaveDialog(false);
    alert('Form saved successfully!');
  };

  const handlePreviewForm = () => {
    if (currentForm.fields.length === 0) {
      alert('Please add at least one field before previewing');
      return;
    }
    router.push('/preview');
  };

  const handleClearForm = () => {
    if (window.confirm('Are you sure you want to clear the current form? All unsaved changes will be lost.')) {
      dispatch(clearCurrentForm());
    }
  };

  const getFieldTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      text: '#1976d2',
      number: '#388e3c',
      textarea: '#7b1fa2',
      select: '#f57c00',
      radio: '#d32f2f',
      checkbox: '#455a64',
      date: '#0288d1',
    };
    return colors[type] || '#666';
  };

  return (
    <Box>
      {/* Header */}
      <Box mb={4}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">
            Form Builder
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<PreviewIcon />}
              onClick={handlePreviewForm}
              disabled={currentForm.fields.length === 0}
            >
              Preview
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={() => setShowSaveDialog(true)}
              disabled={currentForm.fields.length === 0}
            >
              Save Form
            </Button>
          </Stack>
        </Stack>
        
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddField}
            disabled={showFieldEditor}
          >
            Add Field
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleClearForm}
            disabled={currentForm.fields.length === 0}
          >
            Clear Form
          </Button>
          <Typography variant="body2" color="text.secondary">
            {currentForm.fields.length} field{currentForm.fields.length !== 1 ? 's' : ''} added
          </Typography>
        </Stack>
      </Box>

      {/* Form Name */}
      {currentForm.name && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="subtitle1">
            Current Form: {currentForm.name}
          </Typography>
        </Alert>
      )}

      {/* Field Editor */}
      {showFieldEditor && (
        <Box mb={4}>
          <FieldEditor
            field={editingField || undefined}
            availableFields={currentForm.fields}
            onSave={handleSaveField}
            onCancel={handleCancelFieldEdit}
            isEditing={!!editingField}
          />
        </Box>
      )}

      {/* Fields List */}
      <Box>
        <Typography variant="h5" gutterBottom>
          Form Fields
        </Typography>
        
        {currentForm.fields.length === 0 ? (
          <Card variant="outlined">
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No fields added yet
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Click "Add Field" to start building your form
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddField}
                disabled={showFieldEditor}
              >
                Add Your First Field
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={2}>
            {currentForm.fields
              .sort((a, b) => a.order - b.order)
              .map((field, index) => (
                <Card key={field.id} variant="outlined">
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <IconButton size="small" sx={{ cursor: 'grab' }}>
                        <DragIcon />
                      </IconButton>
                      
                      <Box sx={{ flex: 1 }}>
                        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                          <Typography variant="h6">
                            {field.label}
                          </Typography>
                          <Chip
                            label={field.type}
                            size="small"
                            sx={{ 
                              bgcolor: getFieldTypeColor(field.type),
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          />
                          {field.required && (
                            <Chip label="Required" size="small" color="error" />
                          )}
                          {field.derivedConfig?.isDerived && (
                            <Chip label="Derived" size="small" color="info" />
                          )}
                        </Stack>
                        
                        <Stack direction="row" spacing={2}>
                          <Typography variant="body2" color="text.secondary">
                            Type: {field.type}
                          </Typography>
                          {field.validationRules.length > 0 && (
                            <Typography variant="body2" color="text.secondary">
                              Validations: {field.validationRules.length}
                            </Typography>
                          )}
                          {field.options && field.options.length > 0 && (
                            <Typography variant="body2" color="text.secondary">
                              Options: {field.options.length}
                            </Typography>
                          )}
                          {field.derivedConfig?.isDerived && (
                            <Typography variant="body2" color="text.secondary">
                              Parents: {field.derivedConfig.parentFields.length}
                            </Typography>
                          )}
                        </Stack>
                      </Box>
                      
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          size="small"
                          onClick={() => handleEditField(field)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteField(field.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
          </Stack>
        )}
      </Box>

      {/* Save Form Dialog */}
      <Dialog open={showSaveDialog} onClose={() => setShowSaveDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Save Form</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Form Name"
            value={saveFormName}
            onChange={(e) => setSaveFormName(e.target.value)}
            margin="normal"
            helperText="Enter a name for your form"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSaveDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveForm} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FormBuilder;


'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  Stack,
  Divider,
} from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Refresh as ResetIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks/redux';
import { validateForm, calculateDerivedValue } from '@/utils/validation';
import { FieldErrors } from '@/types/form';
import FormFieldRenderer from './FormFieldRenderer';

const FormPreview: React.FC = () => {
  const router = useRouter();
  const { currentForm } = useAppSelector(state => state.formBuilder);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  // Initialize form data with default values
  useEffect(() => {
    const initialData: Record<string, any> = {};
    
    currentForm.fields.forEach(field => {
      if (field.defaultValue !== undefined && field.defaultValue !== null) {
        initialData[field.id] = field.defaultValue;
      } else {
        // Set appropriate default values based on field type
        switch (field.type) {
          case 'checkbox':
            initialData[field.id] = false;
            break;
          case 'number':
            initialData[field.id] = '';
            break;
          default:
            initialData[field.id] = '';
        }
      }
    });

    setFormData(initialData);
  }, [currentForm.fields]);

  // Calculate derived fields whenever form data changes
  useEffect(() => {
    const derivedFields = currentForm.fields.filter(field => field.derivedConfig?.isDerived);
    
    if (derivedFields.length > 0) {
      const updatedData = { ...formData };
      let hasChanges = false;

      derivedFields.forEach(field => {
        const calculatedValue = calculateDerivedValue(field, formData, currentForm.fields);
        if (updatedData[field.id] !== calculatedValue) {
          updatedData[field.id] = calculatedValue;
          hasChanges = true;
        }
      });

      if (hasChanges) {
        setFormData(updatedData);
      }
    }
  }, [formData, currentForm.fields]);

  // Validate form whenever data changes (if validation is enabled)
  useEffect(() => {
    if (showValidation) {
      const validation = validateForm(currentForm.fields, formData);
      setErrors(validation.errors);
    }
  }, [formData, currentForm.fields, showValidation]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = () => {
    setShowValidation(true);
    const validation = validateForm(currentForm.fields, formData);
    setErrors(validation.errors);
    
    if (validation.isValid) {
      setIsSubmitted(true);
      alert('Form submitted successfully!');
    } else {
      alert('Please fix the validation errors before submitting.');
    }
  };

  const handleReset = () => {
    setShowValidation(false);
    setIsSubmitted(false);
    setErrors({});
    
    const resetData: Record<string, any> = {};
    currentForm.fields.forEach(field => {
      if (field.defaultValue !== undefined && field.defaultValue !== null) {
        resetData[field.id] = field.defaultValue;
      } else {
        switch (field.type) {
          case 'checkbox':
            resetData[field.id] = false;
            break;
          case 'number':
            resetData[field.id] = '';
            break;
          default:
            resetData[field.id] = '';
        }
      }
    });
    
    setFormData(resetData);
  };

  const handleValidateNow = () => {
    setShowValidation(true);
    const validation = validateForm(currentForm.fields, formData);
    setErrors(validation.errors);
  };

  if (currentForm.fields.length === 0) {
    return (
      <Box>
        <Alert severity="warning" sx={{ mb: 3 }}>
          No form to preview. Please create a form first.
        </Alert>
        <Button
          variant="contained"
          onClick={() => router.push('/create')}
        >
          Go to Form Builder
        </Button>
      </Box>
    );
  }

  const hasValidationErrors = Object.keys(errors).length > 0;
  const nonDerivedFields = currentForm.fields.filter(f => !f.derivedConfig?.isDerived);
  const derivedFields = currentForm.fields.filter(f => f.derivedConfig?.isDerived);

  return (
    <Box>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Form Preview
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {currentForm.name ? `Preview: ${currentForm.name}` : 'Form Preview'}
        </Typography>
        
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            variant="outlined"
            onClick={() => router.push('/create')}
          >
            Back to Builder
          </Button>
          <Button
            variant="outlined"
            startIcon={<ResetIcon />}
            onClick={handleReset}
          >
            Reset Form
          </Button>
          {!showValidation && (
            <Button
              variant="outlined"
              color="info"
              onClick={handleValidateNow}
            >
              Validate Now
            </Button>
          )}
        </Stack>
      </Box>

      {/* Form Content */}
      <Card>
        <CardContent sx={{ p: 4 }}>
          {/* Validation Status */}
          {showValidation && (
            <Alert 
              severity={hasValidationErrors ? 'error' : 'success'} 
              icon={hasValidationErrors ? <ErrorIcon /> : <SuccessIcon />}
              sx={{ mb: 3 }}
            >
              {hasValidationErrors 
                ? `Form has ${Object.keys(errors).length} validation error(s)`
                : 'Form is valid and ready to submit'
              }
            </Alert>
          )}

          {/* Form Fields */}
          <Stack spacing={3}>
            {/* Regular Fields */}
            {nonDerivedFields
              .sort((a, b) => a.order - b.order)
              .map((field) => (
                <FormFieldRenderer
                  key={field.id}
                  field={field}
                  value={formData[field.id]}
                  onChange={(value) => handleFieldChange(field.id, value)}
                  errors={errors[field.id] || []}
                />
              ))}

            {/* Derived Fields Section */}
            {derivedFields.length > 0 && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" color="primary" gutterBottom>
                  Calculated Fields
                </Typography>
                {derivedFields
                  .sort((a, b) => a.order - b.order)
                  .map((field) => (
                    <FormFieldRenderer
                      key={field.id}
                      field={field}
                      value={formData[field.id]}
                      onChange={(value) => handleFieldChange(field.id, value)}
                      errors={errors[field.id] || []}
                      disabled={true}
                    />
                  ))}
              </>
            )}
          </Stack>

          {/* Submit Button */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={isSubmitted}
              sx={{ minWidth: 200 }}
            >
              {isSubmitted ? 'Submitted' : 'Submit Form'}
            </Button>
          </Box>

          {/* Debug Information */}
          {process.env.NODE_ENV === 'development' && (
            <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Debug Information:
              </Typography>
              <Typography variant="caption" component="pre" sx={{ fontSize: '0.75rem' }}>
                {JSON.stringify(formData, null, 2)}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default FormPreview;


'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Stack,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { FormField, FieldType } from '@/types/form';
import FieldTypeSelector from './FieldTypeSelector';
import ValidationRulesEditor from './ValidationRulesEditor';
import FieldOptionsEditor from './FieldOptionsEditor';
import DerivedFieldEditor from './DerivedFieldEditor';

interface FieldEditorProps {
  field?: FormField;
  availableFields: FormField[];
  onSave: (field: Omit<FormField, 'id' | 'order'>) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const FieldEditor: React.FC<FieldEditorProps> = ({
  field,
  availableFields,
  onSave,
  onCancel,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<Omit<FormField, 'id' | 'order'>>(() => {
    const type = field?.type || 'text';
    const isOptionField = type === 'select' || type === 'radio';
    
    return {
      type,
      label: field?.label || '',
      required: field?.required || false,
      defaultValue: field?.defaultValue || '',
      validationRules: field?.validationRules || [],
      options: isOptionField ? (field?.options || []) : undefined,
      derivedConfig: field?.derivedConfig || {
        isDerived: false,
        parentFields: [],
        formula: '',
      },
    };
  });

  const [expandedSections, setExpandedSections] = useState<string[]>(['basic']);

  const handleSectionToggle = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleSave = () => {
    if (!formData.label.trim()) return;

    // Validate options for select/radio fields
    if ((formData.type === 'select' || formData.type === 'radio') && (!formData.options || formData.options.length === 0)) {
      alert('Please add at least one option for this field type.');
      return;
    }

    // Validate derived field configuration
    if (formData.derivedConfig?.isDerived && formData.derivedConfig.parentFields.length === 0) {
      alert('Please select at least one parent field for the derived field.');
      return;
    }

    onSave(formData);
  };

  const getDefaultValue = () => {
    switch (formData.type) {
      case 'number':
        return typeof formData.defaultValue === 'number' ? formData.defaultValue : '';
      case 'checkbox':
        return Boolean(formData.defaultValue);
      case 'date':
        return formData.defaultValue instanceof Date ? formData.defaultValue.toISOString().split('T')[0] : '';
      default:
        return String(formData.defaultValue || '');
    }
  };

  const handleDefaultValueChange = (value: any) => {
    let processedValue = value;
    
    switch (formData.type) {
      case 'number':
        processedValue = value ? Number(value) : undefined;
        break;
      case 'checkbox':
        processedValue = Boolean(value);
        break;
      case 'date':
        processedValue = value;
        break;
      default:
        processedValue = String(value);
    }

    setFormData(prev => ({ ...prev, defaultValue: processedValue }));
  };

  const needsOptions = formData.type === 'select' || formData.type === 'radio';

  const handleTypeChange = (type: FieldType) => {
    setFormData(prev => ({
      ...prev,
      type,
      // Set options to empty array for select/radio, undefined for other types
      options: (type === 'select' || type === 'radio') ? (prev.options || []) : undefined,
      // Reset default value when type changes
      defaultValue: ''
    }));
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {isEditing ? 'Edit Field' : 'Add New Field'}
        </Typography>

        {/* Basic Configuration */}
        <Accordion 
          expanded={expandedSections.includes('basic')}
          onChange={() => handleSectionToggle('basic')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">Basic Configuration</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={3}>
              <FieldTypeSelector
                value={formData.type}
                onChange={handleTypeChange}
                disabled={isEditing}
              />

              <TextField
                fullWidth
                label="Field Label"
                value={formData.label}
                onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                required
                helperText="This will be displayed as the field label"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.required}
                    onChange={(e) => setFormData(prev => ({ ...prev, required: e.target.checked }))}
                  />
                }
                label="Required field"
              />

              {/* Default Value */}
              {formData.type !== 'checkbox' && (
                <TextField
                  fullWidth
                  label="Default Value"
                  type={formData.type === 'number' ? 'number' : formData.type === 'date' ? 'date' : 'text'}
                  value={getDefaultValue()}
                  onChange={(e) => handleDefaultValueChange(e.target.value)}
                  helperText="Optional default value for this field"
                  InputLabelProps={formData.type === 'date' ? { shrink: true } : undefined}
                />
              )}

              {formData.type === 'checkbox' && (
                <FormControlLabel
                  control={
                    <Switch
                      checked={Boolean(formData.defaultValue)}
                      onChange={(e) => handleDefaultValueChange(e.target.checked)}
                    />
                  }
                  label="Default checked state"
                />
              )}
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Options Configuration */}
        {needsOptions && (
          <Accordion 
            expanded={expandedSections.includes('options')}
            onChange={() => handleSectionToggle('options')}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Options</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FieldOptionsEditor
                options={formData.options || []}
                onChange={(options) => setFormData(prev => ({ ...prev, options }))}
                fieldType={formData.type as 'select' | 'radio'}
              />
            </AccordionDetails>
          </Accordion>
        )}

        {/* Validation Rules */}
        <Accordion 
          expanded={expandedSections.includes('validation')}
          onChange={() => handleSectionToggle('validation')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">Validation Rules</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ValidationRulesEditor
              rules={formData.validationRules}
              onChange={(validationRules) => setFormData(prev => ({ ...prev, validationRules }))}
            />
          </AccordionDetails>
        </Accordion>

        {/* Derived Field Configuration */}
        <Accordion 
          expanded={expandedSections.includes('derived')}
          onChange={() => handleSectionToggle('derived')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">Derived Field</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <DerivedFieldEditor
              config={formData.derivedConfig!}
              onChange={(derivedConfig) => setFormData(prev => ({ ...prev, derivedConfig }))}
              availableFields={availableFields}
              currentFieldId={field?.id}
            />
          </AccordionDetails>
        </Accordion>
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end', gap: 1 }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          startIcon={<CancelIcon />}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={!formData.label.trim()}
        >
          {isEditing ? 'Update Field' : 'Add Field'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default FieldEditor;


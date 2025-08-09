'use client';

import React from 'react';
import {
  Box,
  Typography,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Stack,
  Alert,
} from '@mui/material';
import { DerivedFieldConfig, FormField } from '@/types/form';

interface DerivedFieldEditorProps {
  config: DerivedFieldConfig;
  onChange: (config: DerivedFieldConfig) => void;
  availableFields: FormField[];
  currentFieldId?: string;
}

const calculationTypes = [
  { value: 'age', label: 'Calculate Age from Date', description: 'Calculate age in years from a date field' },
  { value: 'sum', label: 'Sum of Numbers', description: 'Add multiple number fields together' },
  { value: 'concatenate', label: 'Concatenate Text', description: 'Join text fields with a separator' },
  { value: 'custom', label: 'Custom Formula', description: 'Write a custom JavaScript expression' },
] as const;

const DerivedFieldEditor: React.FC<DerivedFieldEditorProps> = ({
  config,
  onChange,
  availableFields,
  currentFieldId,
}) => {
  // Filter out the current field to prevent self-reference
  const selectableFields = availableFields.filter(field => 
    field.id !== currentFieldId && !field.derivedConfig?.isDerived
  );

  const handleToggleDerived = (isDerived: boolean) => {
    onChange({
      ...config,
      isDerived,
      parentFields: isDerived ? config.parentFields : [],
      formula: isDerived ? config.formula : '',
      calculationType: isDerived ? config.calculationType : undefined,
    });
  };

  const handleParentFieldToggle = (fieldId: string) => {
    const isSelected = config.parentFields.includes(fieldId);
    const newParentFields = isSelected
      ? config.parentFields.filter(id => id !== fieldId)
      : [...config.parentFields, fieldId];
    
    onChange({
      ...config,
      parentFields: newParentFields,
    });
  };

  const handleCalculationTypeChange = (calculationType: DerivedFieldConfig['calculationType']) => {
    let defaultFormula = '';
    
    switch (calculationType) {
      case 'age':
        defaultFormula = 'Math.floor((new Date() - new Date(parentValues[0])) / (365.25 * 24 * 60 * 60 * 1000))';
        break;
      case 'sum':
        defaultFormula = 'parentValues.reduce((sum, val) => sum + (Number(val) || 0), 0)';
        break;
      case 'concatenate':
        defaultFormula = 'parentValues.filter(Boolean).join(" ")';
        break;
      case 'custom':
        defaultFormula = '// Write your custom formula here\n// parentValues array contains the values of parent fields\nreturn parentValues[0];';
        break;
    }

    onChange({
      ...config,
      calculationType,
      formula: defaultFormula,
    });
  };

  const getFieldLabel = (fieldId: string) => {
    const field = selectableFields.find(f => f.id === fieldId);
    return field ? field.label : fieldId;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Derived Field Configuration
      </Typography>

      <FormControlLabel
        control={
          <Switch
            checked={config.isDerived}
            onChange={(e) => handleToggleDerived(e.target.checked)}
          />
        }
        label="Make this a derived field"
      />

      {config.isDerived && (
        <Stack spacing={3} sx={{ mt: 2 }}>
          <Alert severity="info">
            Derived fields automatically calculate their value based on other fields in the form.
          </Alert>

          {/* Parent Fields Selection */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Parent Fields
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Select the fields that this derived field should depend on:
            </Typography>
            
            {selectableFields.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No fields available. Add other fields first to create dependencies.
              </Typography>
            ) : (
              <Stack spacing={1}>
                {selectableFields.map((field) => (
                  <FormControlLabel
                    key={field.id}
                    control={
                      <Switch
                        checked={config.parentFields.includes(field.id)}
                        onChange={() => handleParentFieldToggle(field.id)}
                      />
                    }
                    label={`${field.label} (${field.type})`}
                  />
                ))}
              </Stack>
            )}

            {config.parentFields.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Selected parent fields:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {config.parentFields.map((fieldId) => (
                    <Chip
                      key={fieldId}
                      label={getFieldLabel(fieldId)}
                      onDelete={() => handleParentFieldToggle(fieldId)}
                      size="small"
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </Box>

          {/* Calculation Type */}
          {config.parentFields.length > 0 && (
            <FormControl fullWidth>
              <InputLabel>Calculation Type</InputLabel>
              <Select
                value={config.calculationType || ''}
                label="Calculation Type"
                onChange={(e) => handleCalculationTypeChange(e.target.value as DerivedFieldConfig['calculationType'])}
              >
                {calculationTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box>
                      <Typography variant="body1">{type.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {type.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Formula Editor */}
          {config.calculationType && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Formula
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={config.formula}
                onChange={(e) => onChange({ ...config, formula: e.target.value })}
                placeholder="Enter your calculation formula..."
                helperText="Use 'parentValues' array to access parent field values. For age calculation, parentValues[0] should be a date."
              />
            </Box>
          )}

          {config.calculationType === 'age' && config.parentFields.length > 0 && (
            <Alert severity="warning">
              Age calculation requires exactly one parent field of type 'date'. Make sure the selected field contains valid dates.
            </Alert>
          )}

          {config.calculationType === 'sum' && config.parentFields.length > 0 && (
            <Alert severity="info">
              Sum calculation will add all numeric values from the selected parent fields. Non-numeric values will be treated as 0.
            </Alert>
          )}
        </Stack>
      )}
    </Box>
  );
};

export default DerivedFieldEditor;


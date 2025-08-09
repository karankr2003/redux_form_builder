'use client';

import React from 'react';
import {
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
  Box,
} from '@mui/material';
import { FormField } from '@/types/form';

interface FormFieldRendererProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  errors: string[];
  disabled?: boolean;
}

const FormFieldRenderer: React.FC<FormFieldRendererProps> = ({
  field,
  value,
  onChange,
  errors,
  disabled = false,
}) => {
  const hasErrors = errors.length > 0;
  const isRequired = field.required;
  const isDerived = field.derivedConfig?.isDerived;

  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <TextField
            fullWidth
            label={field.label}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            error={hasErrors}
            helperText={hasErrors ? errors.join(', ') : ''}
            required={isRequired}
            disabled={disabled || isDerived}
            variant="outlined"
          />
        );

      case 'number':
        return (
          <TextField
            fullWidth
            type="number"
            label={field.label}
            value={value || ''}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')}
            error={hasErrors}
            helperText={hasErrors ? errors.join(', ') : ''}
            required={isRequired}
            disabled={disabled || isDerived}
            variant="outlined"
          />
        );

      case 'textarea':
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            label={field.label}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            error={hasErrors}
            helperText={hasErrors ? errors.join(', ') : ''}
            required={isRequired}
            disabled={disabled || isDerived}
            variant="outlined"
          />
        );

      case 'select':
        return (
          <FormControl fullWidth error={hasErrors} disabled={disabled || isDerived}>
            <InputLabel required={isRequired}>{field.label}</InputLabel>
            <Select
              value={value || ''}
              label={field.label}
              onChange={(e) => onChange(e.target.value)}
            >
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {hasErrors && (
              <FormHelperText>{errors.join(', ')}</FormHelperText>
            )}
          </FormControl>
        );

      case 'radio':
        return (
          <FormControl error={hasErrors} disabled={disabled || isDerived}>
            <FormLabel component="legend" required={isRequired}>
              {field.label}
            </FormLabel>
            <RadioGroup
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
            >
              {field.options?.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
            {hasErrors && (
              <FormHelperText>{errors.join(', ')}</FormHelperText>
            )}
          </FormControl>
        );

      case 'checkbox':
        return (
          <FormControl error={hasErrors} disabled={disabled || isDerived}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(value)}
                  onChange={(e) => onChange(e.target.checked)}
                />
              }
              label={field.label}
              required={isRequired}
            />
            {hasErrors && (
              <FormHelperText>{errors.join(', ')}</FormHelperText>
            )}
          </FormControl>
        );

      case 'date':
        return (
          <TextField
            fullWidth
            type="date"
            label={field.label}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            error={hasErrors}
            helperText={hasErrors ? errors.join(', ') : ''}
            required={isRequired}
            disabled={disabled || isDerived}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
        );

      default:
        return (
          <TextField
            fullWidth
            label={field.label}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            error={hasErrors}
            helperText={hasErrors ? errors.join(', ') : ''}
            required={isRequired}
            disabled={disabled || isDerived}
            variant="outlined"
          />
        );
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      {renderField()}
      {isDerived && (
        <FormHelperText sx={{ mt: 1, color: 'info.main' }}>
          This field is automatically calculated based on other fields
        </FormHelperText>
      )}
    </Box>
  );
};

export default FormFieldRenderer;


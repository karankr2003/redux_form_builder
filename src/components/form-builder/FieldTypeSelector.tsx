'use client';

import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { FieldType } from '@/types/form';

interface FieldTypeSelectorProps {
  value: FieldType;
  onChange: (type: FieldType) => void;
  disabled?: boolean;
}

const fieldTypeOptions = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'select', label: 'Select' },
  { value: 'radio', label: 'Radio' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'date', label: 'Date' },
] as const;

const FieldTypeSelector: React.FC<FieldTypeSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as FieldType);
  };

  return (
    <FormControl fullWidth disabled={disabled}>
      <InputLabel>Field Type</InputLabel>
      <Select
        value={value}
        label="Field Type"
        onChange={handleChange}
      >
        {fieldTypeOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FieldTypeSelector;


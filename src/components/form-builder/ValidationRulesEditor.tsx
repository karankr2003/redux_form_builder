'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Chip,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { ValidationRule } from '@/types/form';

interface ValidationRulesEditorProps {
  rules: ValidationRule[];
  onChange: (rules: ValidationRule[]) => void;
}

const validationTypes = [
  { value: 'required', label: 'Required', hasValue: false },
  { value: 'notEmpty', label: 'Not Empty', hasValue: false },
  { value: 'minLength', label: 'Minimum Length', hasValue: true },
  { value: 'maxLength', label: 'Maximum Length', hasValue: true },
  { value: 'email', label: 'Email Format', hasValue: false },
  { value: 'password', label: 'Password (8+ chars, 1 number)', hasValue: false },
] as const;

const ValidationRulesEditor: React.FC<ValidationRulesEditorProps> = ({
  rules,
  onChange,
}) => {
  const [newRule, setNewRule] = useState<{
    type: ValidationRule['type'] | null;
    value: string;
    message: string;
  }>({
    type: null,
    value: '',
    message: '',
  });

  const handleAddRule = () => {
    if (!newRule.type) return;
    
    const rule: ValidationRule = {
      type: newRule.type,
      message: newRule.message || getDefaultMessage(newRule.type, newRule.value),
    };

    if (['minLength', 'maxLength'].includes(newRule.type)) {
      rule.value = Number(newRule.value) || 0;
    }

    onChange([...rules, rule]);
    setNewRule({ type: null, value: '', message: '' });
  };

  const removeRule = (index: number) => {
    const updatedRules = rules.filter((_, i) => i !== index);
    onChange(updatedRules);
  };

  const getDefaultMessage = (type: ValidationRule['type'], value?: string) => {
    switch (type) {
      case 'required':
        return 'This field is required';
      case 'notEmpty':
        return 'This field cannot be empty';
      case 'minLength':
        return `Minimum length is ${value || 'N'} characters`;
      case 'maxLength':
        return `Maximum length is ${value || 'N'} characters`;
      case 'email':
        return 'Please enter a valid email address';
      case 'password':
        return 'Password must be at least 8 characters long and contain at least one number';
      default:
        return '';
    }
  };

  const handleTypeChange = (type: ValidationRule['type']) => {
    setNewRule(prev => ({
      ...prev,
      type,
      message: getDefaultMessage(type, prev.value),
    }));
  };

  const selectedRuleType = validationTypes.find(t => t.value === newRule.type);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Validation Rules
      </Typography>

      {/* Existing Rules */}
      {rules.length > 0 && (
        <Stack spacing={1} mb={2}>
          {rules.map((rule, index) => (
            <Chip
              key={index}
              label={`${rule.type}${rule.value ? `: ${rule.value}` : ''} - ${rule.message}`}
              onDelete={() => removeRule(index)}
              deleteIcon={<DeleteIcon />}
              variant="outlined"
            />
          ))}
        </Stack>
      )}

      {/* Add New Rule */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle2" gutterBottom>
            Add Validation Rule
          </Typography>
          
          <Stack spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Validation Type</InputLabel>
              <Select
                value={newRule.type || ''}
                label="Validation Type"
                onChange={(e) => handleTypeChange(e.target.value as ValidationRule['type'])}
                displayEmpty
              >
                {validationTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedRuleType?.hasValue && (
              <TextField
                fullWidth
                label="Value"
                type="number"
                value={newRule.value}
                onChange={(e) => setNewRule(prev => {
                  // Only update if we have a valid rule type
                  if (!prev.type) return { ...prev, value: e.target.value };
                  return {
                    ...prev,
                    value: e.target.value,
                    message: getDefaultMessage(prev.type, e.target.value),
                  };
                })}
                helperText="Enter the length value"
              />
            )}

            <TextField
              fullWidth
              label="Error Message"
              value={newRule.message}
              onChange={(e) => setNewRule(prev => ({
                ...prev,
                message: e.target.value,
              }))}
              helperText="Message to show when validation fails"
            />

            <Button
              startIcon={<AddIcon />}
              onClick={handleAddRule}
              disabled={!newRule.type || !newRule.message}
              variant="outlined"
            >
              Add Rule
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ValidationRulesEditor;


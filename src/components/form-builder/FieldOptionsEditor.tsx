'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  IconButton,
  Typography,
  Stack,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
} from '@mui/icons-material';
import { SelectOption } from '@/types/form';

interface FieldOptionsEditorProps {
  options: SelectOption[];
  onChange: (options: SelectOption[]) => void;
  fieldType: 'select' | 'radio';
}

const FieldOptionsEditor: React.FC<FieldOptionsEditorProps> = ({
  options,
  onChange,
  fieldType,
}) => {
  const [newOption, setNewOption] = useState({ label: '', value: '' });

  const addOption = () => {
    if (!newOption.label.trim() || !newOption.value.trim()) return;

    const updatedOptions = [...options, { ...newOption }];
    onChange(updatedOptions);
    setNewOption({ label: '', value: '' });
  };

  const updateOption = (index: number, field: keyof SelectOption, value: string) => {
    const updatedOptions = options.map((option, i) =>
      i === index ? { ...option, [field]: value } : option
    );
    onChange(updatedOptions);
  };

  const removeOption = (index: number) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    onChange(updatedOptions);
  };

  const moveOption = (fromIndex: number, toIndex: number) => {
    const updatedOptions = [...options];
    const [movedOption] = updatedOptions.splice(fromIndex, 1);
    updatedOptions.splice(toIndex, 0, movedOption);
    onChange(updatedOptions);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {fieldType === 'select' ? 'Select Options' : 'Radio Options'}
      </Typography>

      {/* Existing Options */}
      <Stack spacing={1} mb={2}>
        {options.map((option, index) => (
          <Card key={index} variant="outlined" sx={{ p: 1 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <IconButton
                size="small"
                sx={{ cursor: 'grab' }}
                onMouseDown={(e) => {
                  // Simple drag implementation could be added here
                  e.preventDefault();
                }}
              >
                <DragIcon />
              </IconButton>
              
              <TextField
                size="small"
                label="Label"
                value={option.label}
                onChange={(e) => updateOption(index, 'label', e.target.value)}
                sx={{ flex: 1 }}
              />
              
              <TextField
                size="small"
                label="Value"
                value={option.value}
                onChange={(e) => updateOption(index, 'value', e.target.value)}
                sx={{ flex: 1 }}
              />
              
              <IconButton
                size="small"
                color="error"
                onClick={() => removeOption(index)}
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          </Card>
        ))}
      </Stack>

      {/* Add New Option */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle2" gutterBottom>
            Add New Option
          </Typography>
          
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              size="small"
              label="Label"
              value={newOption.label}
              onChange={(e) => setNewOption(prev => ({ ...prev, label: e.target.value }))}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addOption();
                }
              }}
              sx={{ flex: 1 }}
            />
            
            <TextField
              size="small"
              label="Value"
              value={newOption.value}
              onChange={(e) => setNewOption(prev => ({ ...prev, value: e.target.value }))}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addOption();
                }
              }}
              sx={{ flex: 1 }}
            />
            
            <Button
              startIcon={<AddIcon />}
              onClick={addOption}
              disabled={!newOption.label.trim() || !newOption.value.trim()}
              variant="outlined"
            >
              Add
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {options.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          No options added yet. Add at least one option for this field type.
        </Typography>
      )}
    </Box>
  );
};

export default FieldOptionsEditor;


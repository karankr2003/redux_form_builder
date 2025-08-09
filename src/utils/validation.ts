import { ValidationRule, FormField, FieldErrors } from '@/types/form';

export const validateField = (
  field: FormField,
  value: any,
  allFieldValues: Record<string, any> = {}
): string[] => {
  const errors: string[] = [];

  // Skip validation for derived fields as they're calculated
  if (field.derivedConfig?.isDerived) {
    return errors;
  }

  for (const rule of field.validationRules) {
    switch (rule.type) {
      case 'required':
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          errors.push(rule.message);
        }
        break;
        
      case 'notEmpty':
        if (typeof value === 'string' && value.trim() === '') {
          errors.push(rule.message);
        }
        break;
        
      case 'minLength':
        if (typeof value === 'string' && rule.value && value.length < Number(rule.value)) {
          errors.push(rule.message);
        }
        break;
        
      case 'maxLength':
        if (typeof value === 'string' && rule.value && value.length > Number(rule.value)) {
          errors.push(rule.message);
        }
        break;
        
      case 'email':
        if (value && typeof value === 'string') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors.push(rule.message);
          }
        }
        break;
        
      case 'password':
        if (value && typeof value === 'string') {
          const hasMinLength = value.length >= 8;
          const hasNumber = /\d/.test(value);
          if (!hasMinLength || !hasNumber) {
            errors.push(rule.message);
          }
        }
        break;
    }
  }

  return errors;
};

export const validateForm = (
  fields: FormField[],
  formData: Record<string, any>
): { isValid: boolean; errors: FieldErrors } => {
  const errors: FieldErrors = {};
  let isValid = true;

  for (const field of fields) {
    const fieldErrors = validateField(field, formData[field.id], formData);
    if (fieldErrors.length > 0) {
      errors[field.id] = fieldErrors;
      isValid = false;
    }
  }

  return { isValid, errors };
};

export const calculateDerivedValue = (
  field: FormField,
  formData: Record<string, any>,
  allFields: FormField[]
): any => {
  if (!field.derivedConfig?.isDerived || !field.derivedConfig.formula) {
    return '';
  }

  try {
    const parentValues = field.derivedConfig.parentFields.map(fieldId => {
      const value = formData[fieldId];
      // Convert to appropriate type based on parent field type
      const parentField = allFields.find(f => f.id === fieldId);
      if (parentField?.type === 'number' && value) {
        return Number(value);
      }
      if (parentField?.type === 'date' && value) {
        return new Date(value);
      }
      return value || '';
    });

    // Create a safe evaluation context
    const context = {
      parentValues,
      Math,
      Date,
      Number,
      String,
      parseInt,
      parseFloat,
    };

    // Handle predefined calculation types
    switch (field.derivedConfig.calculationType) {
      case 'age':
        if (parentValues[0] instanceof Date || typeof parentValues[0] === 'string') {
          const birthDate = new Date(parentValues[0]);
          const today = new Date();
          const age = Math.floor((today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
          return isNaN(age) ? 0 : age;
        }
        return 0;
        
      case 'sum':
        return parentValues.reduce((sum, val) => sum + (Number(val) || 0), 0);
        
      case 'concatenate':
        return parentValues.filter(val => val !== undefined && val !== null && val !== '').join(' ');
        
      case 'custom':
        // For custom formulas, we'll use a simple evaluation
        // In a production app, you'd want to use a proper expression evaluator
        try {
          // Create a function that evaluates the formula safely
          const func = new Function('parentValues', 'Math', 'Date', 'Number', 'String', 'parseInt', 'parseFloat', 
            `"use strict"; ${field.derivedConfig.formula}`
          );
          return func(parentValues, Math, Date, Number, String, parseInt, parseFloat);
        } catch (error) {
          console.error('Error evaluating custom formula:', error);
          return 'Error in formula';
        }
    }

    return '';
  } catch (error) {
    console.error('Error calculating derived value:', error);
    return 'Calculation error';
  }
};


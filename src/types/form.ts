export type FieldType = 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'email' | 'password' | 'notEmpty';
  value?: number | string;
  message: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface DerivedFieldConfig {
  isDerived: boolean;
  parentFields: string[];
  formula: string; // JavaScript expression or predefined calculation type
  calculationType?: 'age' | 'sum' | 'concatenate' | 'custom';
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  defaultValue?: string | number | boolean | string[];
  validationRules: ValidationRule[];
  options?: SelectOption[]; // For select and radio fields
  derivedConfig?: DerivedFieldConfig;
  order: number;
}

export interface FormSchema {
  id: string;
  name: string;
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
}

export interface FormBuilderState {
  currentForm: {
    name: string;
    fields: FormField[];
  };
  savedForms: FormSchema[];
  previewData: Record<string, any>;
  isLoading: boolean;
  error: string | null;
}

export interface FieldErrors {
  [fieldId: string]: string[];
}

export interface FormValidationResult {
  isValid: boolean;
  errors: FieldErrors;
}


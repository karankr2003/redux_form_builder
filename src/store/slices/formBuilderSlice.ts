import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormBuilderState, FormField, FormSchema, ValidationRule } from '@/types/form';

const initialState: FormBuilderState = {
  currentForm: {
    name: '',
    fields: [],
  },
  savedForms: [],
  previewData: {},
  isLoading: false,
  error: null,
};

const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    setFormName: (state, action: PayloadAction<string>) => {
      state.currentForm.name = action.payload;
    },
    addField: (state, action: PayloadAction<Omit<FormField, 'id' | 'order'>>) => {
      const newField: FormField = {
        ...action.payload,
        id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        order: state.currentForm.fields.length,
      };
      state.currentForm.fields.push(newField);
    },
    updateField: (state, action: PayloadAction<{ id: string; updates: Partial<FormField> }>) => {
      const { id, updates } = action.payload;
      const fieldIndex = state.currentForm.fields.findIndex(field => field.id === id);
      if (fieldIndex !== -1) {
        state.currentForm.fields[fieldIndex] = {
          ...state.currentForm.fields[fieldIndex],
          ...updates,
        };
      }
    },
    deleteField: (state, action: PayloadAction<string>) => {
      state.currentForm.fields = state.currentForm.fields.filter(field => field.id !== action.payload);
      // Reorder remaining fields
      state.currentForm.fields.forEach((field, index) => {
        field.order = index;
      });
    },
    reorderFields: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      const { fromIndex, toIndex } = action.payload;
      const [movedField] = state.currentForm.fields.splice(fromIndex, 1);
      state.currentForm.fields.splice(toIndex, 0, movedField);
      // Update order values
      state.currentForm.fields.forEach((field, index) => {
        field.order = index;
      });
    },
    addValidationRule: (state, action: PayloadAction<{ fieldId: string; rule: ValidationRule }>) => {
      const { fieldId, rule } = action.payload;
      const field = state.currentForm.fields.find(f => f.id === fieldId);
      if (field) {
        field.validationRules.push(rule);
      }
    },
    removeValidationRule: (state, action: PayloadAction<{ fieldId: string; ruleIndex: number }>) => {
      const { fieldId, ruleIndex } = action.payload;
      const field = state.currentForm.fields.find(f => f.id === fieldId);
      if (field && field.validationRules[ruleIndex]) {
        field.validationRules.splice(ruleIndex, 1);
      }
    },
    saveForm: (state) => {
      if (state.currentForm.name && state.currentForm.fields.length > 0) {
        const formSchema: FormSchema = {
          id: `form_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: state.currentForm.name,
          fields: [...state.currentForm.fields],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        state.savedForms.push(formSchema);
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('savedForms', JSON.stringify(state.savedForms));
        }
      }
    },
    loadSavedForms: (state) => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('savedForms');
        if (saved) {
          state.savedForms = JSON.parse(saved);
        }
      }
    },
    loadFormForPreview: (state, action: PayloadAction<string>) => {
      const formId = action.payload;
      const form = state.savedForms.find(f => f.id === formId);
      if (form) {
        state.currentForm = {
          name: form.name,
          fields: [...form.fields],
        };
      }
    },
    updatePreviewData: (state, action: PayloadAction<{ fieldId: string; value: any }>) => {
      const { fieldId, value } = action.payload;
      state.previewData[fieldId] = value;
    },
    clearPreviewData: (state) => {
      state.previewData = {};
    },
    clearCurrentForm: (state) => {
      state.currentForm = {
        name: '',
        fields: [],
      };
      state.previewData = {};
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setFormName,
  addField,
  updateField,
  deleteField,
  reorderFields,
  addValidationRule,
  removeValidationRule,
  saveForm,
  loadSavedForms,
  loadFormForPreview,
  updatePreviewData,
  clearPreviewData,
  clearCurrentForm,
  setLoading,
  setError,
} = formBuilderSlice.actions;

export default formBuilderSlice.reducer;


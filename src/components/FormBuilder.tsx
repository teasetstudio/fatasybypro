import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from './ui/Input/Input';

// Define field types
export type FieldType = 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'checkbox' | 'radio' | 'textarea';

// Define validation rules
export interface ValidationRule {
  type: 'required' | 'optional' | 'email' | 'min' | 'max' | 'pattern' | 'minLength' | 'maxLength';
  value?: any;
  message: string;
}

// Define field configuration
export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: { label: string; value: string | number }[]; // For select, checkbox, radio
  validationRules?: ValidationRule[];
  defaultValue?: any;
}

// Define form configuration
export interface FormConfig {
  title?: string;
  fields: FieldConfig[];
  onSubmit: (data: any) => void;
  submitButtonText?: string;
}

// Helper function to build Yup validation schema from config
const buildYupSchema = (fields: FieldConfig[]) => {
  const schemaFields: Record<string, any> = {};

  fields.forEach((field) => {
    let fieldSchema: any;

    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'select':
      case 'radio':
        fieldSchema = yup.string();
        break;
      case 'number':
        fieldSchema = yup.number();
        break;
      case 'date':
        fieldSchema = yup.date();
        break;
      case 'checkbox':
        fieldSchema = yup.boolean();
        break;
      default:
        fieldSchema = yup.mixed();
    }

    let isRequired = false;

    // Apply validation rules
    if (field.validationRules) {
      field.validationRules.forEach((rule) => {
        switch (rule.type) {
          case 'required':
            isRequired = true;
            fieldSchema = fieldSchema.required(rule.message);
            break;
          case 'email':
            if (field.type === 'email' || field.type === 'text') {
              fieldSchema = fieldSchema.email(rule.message);
            }
            break;
          case 'min':
            if (field.type === 'number') {
              fieldSchema = fieldSchema.min(rule.value, rule.message);
            }
            break;
          case 'max':
            if (field.type === 'number') {
              fieldSchema = fieldSchema.max(rule.value, rule.message);
            }
            break;
          case 'minLength':
            if (field.type === 'text' || field.type === 'password' || field.type === 'email') {
              fieldSchema = fieldSchema.min(rule.value, rule.message);
            }
            break;
          case 'maxLength':
            if (field.type === 'text' || field.type === 'password' || field.type === 'email') {
              fieldSchema = fieldSchema.max(rule.value, rule.message);
            }
            break;
          case 'pattern':
            if (field.type === 'text' || field.type === 'password' || field.type === 'email') {
              fieldSchema = fieldSchema.matches(new RegExp(rule.value), rule.message);
            }
            break;
        }
      });
    }

    // If no required rule, make the field optional
    if (!isRequired) {
      fieldSchema = fieldSchema
        .transform((value: any) => (value === "" ? undefined : value))
        .optional();
    }

    schemaFields[field.name] = fieldSchema;
  });

  return yup.object().shape(schemaFields);
};

const FormBuilder: React.FC<FormConfig> = ({ fields, onSubmit, submitButtonText = 'Submit', title }) => {
  // Build validation schema from config
  const schema = buildYupSchema(fields);

  // Initialize form with validation schema
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: fields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue || '';
      return acc;
    }, {} as Record<string, any>),
  });

  // Render field based on its type
  const renderField = (field: FieldConfig) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
      case 'date':
        return (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <Input
                type={field.type}
                placeholder={field.placeholder || ''}
                value={value}
                onChange={onChange}
                className="w-full"
              />
            )}
          />
        );
      
      case 'textarea':
        return (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <textarea
                placeholder={field.placeholder || ''}
                value={value}
                onChange={onChange}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary w-full"
                rows={4}
              />
            )}
          />
        );
      
      case 'select':
        return (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <select
                value={value}
                onChange={onChange}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary w-full"
              >
                <option value="">Select an option</option>
                {field.options?.map((option) => (
                  <option key={option.value.toString()} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          />
        );
      
      case 'checkbox':
        return (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={onChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="ml-2">{field.placeholder}</span>
              </div>
            )}
          />
        );
      
      case 'radio':
        return (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <div className="space-y-2">
                {field.options?.map((option) => (
                  <div key={option.value.toString()} className="flex items-center">
                    <input
                      type="radio"
                      id={`${field.name}-${option.value}`}
                      value={option.value.toString()}
                      checked={value === option.value.toString()}
                      onChange={() => onChange(option.value.toString())}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <label htmlFor={`${field.name}-${option.value}`} className="ml-2">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            )}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
        {fields.map((field) => (
          <div key={field.name} className="space-y-1">
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
              {field.label}
            </label>
            {renderField(field)}
            {errors[field.name] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[field.name]?.message?.toString()}
              </p>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
        >
          {submitButtonText}
        </button>
      </form>
    </>
  );
};

export default FormBuilder;
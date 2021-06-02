export interface TextareaConfig {
  title: string;
  description?: string;
  displayModifier: FormBuilder.DisplayModifier;
  placeholder?: string;
  valueFormat: 'phone' | 'post_code' | 'mobile_phone' | 'id_number' | 'email' | string;
  required: boolean;
  defaultValue: string;
}

export const defaultConfig: TextareaConfig = {
  title: '多行文本',
  description: '',
  displayModifier: 'normal',
  placeholder: '',
  valueFormat: '',
  required: false,
  defaultValue: '',
};

export function toSchema(value: TextareaConfig): FormBuilder.Schema {
  return {
    type: 'string',
    title: value.title,
    description: value.description,
    required: value.required,
    format: value.valueFormat,
    readOnly: value.displayModifier === 'readonly',
    display: value.displayModifier !== 'hidden',
    'x-component': 'textarea',
    ['x-component-props']: {
      placeholder: value.placeholder,
      defaultValue: value.defaultValue,
    },
    ['x-internal']: {
      permission: 3,
    },
  };
}

export function toConfig(schema: FormBuilder.Schema): TextareaConfig {
  let displayModifier: FormBuilder.DisplayModifier = 'normal';
  if (schema.readOnly) {
    displayModifier = 'readonly';
  } else if (!schema.display) {
    displayModifier = 'hidden';
  }

  return {
    title: schema.title as string,
    description: schema.description as string,
    displayModifier: displayModifier,
    placeholder: schema['x-component-props']?.placeholder || '',
    defaultValue: schema['x-component-props']?.defaultValue || '',
    valueFormat: schema.format || '',
    required: !!schema.required,
  };
}

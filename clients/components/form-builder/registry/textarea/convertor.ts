export interface TextareaConfig {
  title: string;
  description?: string;
  displayModifier: FormBuilder.DisplayModifier;
  placeholder?: string;
  sortable: boolean;
  valueFormat: 'phone' | 'post_code' | 'mobile_phone' | 'id_number' | 'email' | string;
  required: boolean;
  defaultValueFrom: FormBuilder.DefaultValueFrom;
  defaultValue: string;
}

export const defaultConfig: TextareaConfig = {
  title: '多行文本',
  description: '',
  displayModifier: 'normal',
  placeholder: '',
  sortable: false,
  valueFormat: '',
  required: false,
  defaultValueFrom: 'customized',
  defaultValue: '',
};

export function toSchema(value: TextareaConfig): ISchema {
  return {
    type: 'string',
    title: value.title,
    description: value.description,
    required: value.required,
    format: value.valueFormat,
    readOnly: value.displayModifier === 'readonly',
    display: value.displayModifier !== 'hidden',
    'x-component': 'Textarea',
    default: value.defaultValue,
    ['x-component-props']: {
      placeholder: value.placeholder,
      defaultValue: value.defaultValue,
    },
    ['x-internal']: {
      sortable: value.sortable,
      defaultValueFrom: value.defaultValueFrom,
      permission: 3,
    },
  };
}

export function toConfig(schema: ISchema): TextareaConfig {
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
    sortable: !!schema['x-internal']?.sortable,
    valueFormat: schema.format || '',
    required: !!schema.required,
    // todo implement this
    defaultValueFrom: schema['x-internal']?.defaultValueFrom || 'customized',
  };
}

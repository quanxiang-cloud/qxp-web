import { getDisplayModifierFromSchema, getSchemaPermissionFromSchemaConfig } from '@c/form-builder/utils';

export interface TextareaConfig {
  title: string;
  description?: string;
  displayModifier: FormBuilder.DisplayModifier;
  placeholder?: string;
  sortable: boolean;
  valueFormat: 'phone' | 'post_code' | 'mobile_phone' | 'id_number' | 'email' | string;
  required: boolean;
  defaultValueFrom: FormBuilder.DefaultValueFrom;
  defaultValue?: string;
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
      autoSize: { minRows: 4 },
      rows: 4,
    },
    ['x-internal']: {
      sortable: value.sortable,
      defaultValueFrom: value.defaultValueFrom,
      permission: getSchemaPermissionFromSchemaConfig(value),
    },
  };
}

export function toConfig(schema: ISchema): TextareaConfig {
  return {
    title: schema.title as string,
    description: schema.description as string,
    displayModifier: getDisplayModifierFromSchema(schema),
    placeholder: schema['x-component-props']?.placeholder || '',
    defaultValue: schema['x-component-props']?.defaultValue || '',
    sortable: !!schema['x-internal']?.sortable,
    valueFormat: schema.format || '',
    required: !!schema.required,
    // todo implement this
    defaultValueFrom: schema['x-internal']?.defaultValueFrom || 'customized',
  };
}

export interface InputConfig {
  title: string;
  description?: string;
  displayModifier: FormBuilder.DisplayModifier;
  placeholder?: string;
  sortable: boolean;
  valueFormat: 'phone' | 'post_code' | 'mobile_phone' | 'id_number' | 'email' | string;
  required: boolean;
  defaultValueFrom: FormBuilder.DefaultValueFrom;
  defaultValue: string;
  defaultValueLinkage?: FormBuilder.DefaultValueLinkage;
}

export const defaultConfig: InputConfig = {
  title: '单行文本',
  description: '',
  displayModifier: 'normal',
  placeholder: '',
  sortable: false,
  valueFormat: '',
  required: false,
  defaultValueFrom: 'customized',
  defaultValue: '',
  defaultValueLinkage: undefined,
};

export function toSchema(value: InputConfig): ISchema {
  return {
    type: 'string',
    title: value.title,
    description: value.description,
    required: value.required,
    format: value.valueFormat,
    readOnly: value.displayModifier === 'readonly',
    display: value.displayModifier !== 'hidden',
    'x-component': 'Input',
    default: value.defaultValue,
    ['x-component-props']: {
      placeholder: value.placeholder,
      defaultValue: value.defaultValue,
    },
    ['x-internal']: {
      sortable: value.sortable,
      permission: 3,
      defaultValueFrom: value.defaultValueFrom,
      defaultValueLinkage: value.defaultValueLinkage,
    },
  };
}

export function toConfig(schema: ISchema): InputConfig {
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
    defaultValueFrom: schema['x-internal']?.defaultValueFrom || 'customized',
    defaultValueLinkage: schema['x-internal']?.defaultValueLinkage,
  };
}

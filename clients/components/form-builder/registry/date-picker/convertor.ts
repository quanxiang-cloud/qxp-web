import { getSchemaPermissionFromSchemaConfig, getDisplayModifierFromSchema } from '@c/form-builder/utils';

type ValueFormat =
  'YYYY' |
  'YYYY-MM' |
  'YYYY-MM-DD' |
  'YYYY-MM-DD HH:mm' |
  'YYYY-MM-DD HH:mm:ss' |
  string;

export interface DatePickerConfig {
  title: string;
  description?: string;
  displayModifier: FormBuilder.DisplayModifier;
  placeholder?: string;
  sortable: boolean;
  valueFormat: ValueFormat;
  required: boolean;
  defaultValueFrom: FormBuilder.DefaultValueFrom;
  defaultValueLinkage?: FormBuilder.DefaultValueLinkage;
  defaultValue?: string,
}

export const defaultConfig: DatePickerConfig = {
  title: '时间日期',
  description: '',
  displayModifier: 'normal',
  placeholder: '',
  sortable: false,
  valueFormat: 'YYYY-MM-DD',
  required: false,
  defaultValueFrom: 'customized',
  defaultValueLinkage: undefined,
};

export function toSchema(value: typeof defaultConfig): ISchema {
  const timeFormat = value.valueFormat?.split(' ')[1];
  return {
    type: 'datetime',
    title: value.title,
    description: value.description,
    required: value.required,
    readOnly: value.displayModifier === 'readonly',
    display: value.displayModifier !== 'hidden',
    'x-component': 'DatePicker',
    ['x-component-props']: {
      placeholder: value.placeholder,
      format: value.valueFormat,
      isNow: value.defaultValueFrom === 'now',
      showTime: timeFormat !== undefined ? { format: timeFormat } : false,
      style: {
        width: '100%',
      },
      defaultValue: value.defaultValue,
    },
    ['x-internal']: {
      sortable: value.sortable,
      permission: getSchemaPermissionFromSchemaConfig(value),
      defaultValueFrom: value.defaultValueFrom || 'customized',
      defaultValueLinkage: value.defaultValueLinkage,
    },
  };
}

export function toConfig(schema: ISchema): DatePickerConfig {
  return {
    title: schema.title as string,
    description: schema.description as string,
    displayModifier: getDisplayModifierFromSchema(schema),
    placeholder: schema['x-component-props']?.placeholder || '',
    sortable: !!schema['x-internal']?.sortable,
    valueFormat: schema['x-component-props']?.format,
    required: !!schema.required,
    defaultValue: schema['x-component-props']?.defaultValue,
    // todo implement this
    defaultValueFrom: schema['x-internal']?.defaultValueFrom || 'customized',
    defaultValueLinkage: schema['x-internal']?.defaultValueLinkage,
  };
}

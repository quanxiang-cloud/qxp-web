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
  valueFormat: ValueFormat;
  required: boolean;
  defaultValue: string;
}

export const defaultConfig: DatePickerConfig = {
  title: '时间日期',
  description: '',
  displayModifier: 'normal',
  placeholder: '',
  valueFormat: '',
  required: false,
  defaultValue: '',
};

export function toSchema(value: typeof defaultConfig): ISchema {
  let xComponent = 'DatePicker';
  const timeFormat = value.valueFormat?.split(' ')[1];
  switch (value.valueFormat) {
  case 'YYYY':
    xComponent = 'YearPicker';
    break;
  case 'YYYY-MM':
    xComponent = 'MonthPicker';
    break;
  case 'YYYY-MM-DD':
    xComponent = 'DatePicker';
    break;
    // case 'YYYY-MM-DD HH:mm':
    //   break;
    // case 'YYYY-MM-DD HH:mm:ss':
    //   break;
  }

  return {
    type: 'datetime',
    title: value.title,
    description: value.description,
    required: value.required,
    readOnly: value.displayModifier === 'readonly',
    display: value.displayModifier !== 'hidden',
    'x-component': xComponent,
    ['x-component-props']: {
      placeholder: value.placeholder,
      format: value.valueFormat,
      showTime: timeFormat !== undefined ? { format: timeFormat } : false,
      defaultValue: value.defaultValue,
    },
    ['x-internal']: {
      sortable: false,
      permission: 3,
      defaultValueFrom: 'customized',
    },
  };
}

export function toConfig(schema: FormBuilder.Schema): DatePickerConfig {
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
    valueFormat: schema['x-component-props']?.format,
    required: !!schema.required,
    defaultValue: schema['x-component-props']?.defaultValue || '',
  };
}

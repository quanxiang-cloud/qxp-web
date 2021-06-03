
export interface NumberPickerConfig {
  title: string;
  description?: string;
  displayModifier: FormBuilder.DisplayModifier;
  placeholder?: string;
  sortable: boolean;
  precision: number;
  required: boolean;
  defaultValue?: string;
}

export const defaultConfig: NumberPickerConfig = {
  title: '数字',
  description: '',
  displayModifier: 'normal',
  placeholder: '',
  sortable: false,
  precision: 2,
  required: false,
};

export function toSchema(value: NumberPickerConfig): FormBuilder.Schema {
  let point = value.precision;
  if (value.precision < 0 ) {
    point = 0;
  }
  if (value.precision > 4) {
    point = 4;
  }

  return {
    type: 'number',
    title: value.title,
    description: value.description,
    required: value.required,
    readOnly: value.displayModifier === 'readonly',
    display: value.displayModifier !== 'hidden',
    'x-component': 'NumberPicker',
    ['x-component-props']: {
      placeholder: value.placeholder,
      precision: point,
      step: 1 / Math.pow(10, point),
      defaultValue: value.defaultValue,
    },
    ['x-internal']: {
      sortable: value.sortable,
      permission: 3,
    },
  };
}

export function toConfig(schema: FormBuilder.Schema): NumberPickerConfig {
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
    sortable: !!schema['x-internal']?.sortable,
    precision: schema['x-component-props']?.precision,
    required: !!schema.required,
    defaultValue: schema['x-component-props']?.defaultValue,
  };
}


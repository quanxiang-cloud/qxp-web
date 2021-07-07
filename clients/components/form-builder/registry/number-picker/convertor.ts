
export interface NumberPickerConfig {
  title: string;
  description?: string;
  displayModifier: FormBuilder.DisplayModifier;
  placeholder?: string;
  sortable: boolean;
  precision: number;
  required: boolean;
  defaultValueFrom: FormBuilder.DefaultValueFrom;
  defaultValue?: string;
  defaultValueLinkage?: FormBuilder.DefaultValueLinkage;
  minimum: number | undefined;
  maximum: number | undefined;
  calculationFormula?: string;
}

export const defaultConfig: NumberPickerConfig = {
  title: '数字',
  description: '',
  displayModifier: 'normal',
  placeholder: '',
  sortable: false,
  precision: 2,
  required: false,
  defaultValueFrom: 'customized',
  maximum: undefined,
  minimum: undefined,
  calculationFormula: '',
};

export function toSchema(value: NumberPickerConfig): ISchema {
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
    },
    ['x-internal']: {
      sortable: value.sortable,
      permission: 3,
      defaultValueFrom: value.defaultValueFrom,
      defaultValueLinkage: value.defaultValueLinkage,
      calculationFormula: value.calculationFormula,
    },
    ['minimum']: value.minimum,
    ['maximum']: value.maximum,
  };
}

export function toConfig(schema: ISchema): NumberPickerConfig {
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
    defaultValueFrom: schema['x-internal']?.defaultValueFrom || 'customized',
    defaultValueLinkage: schema['x-internal']?.defaultValueLinkage,
    minimum: schema['minimum'],
    maximum: schema['maximum'],
    calculationFormula: schema['x-internal']?.calculationFormula || '',
  };
}


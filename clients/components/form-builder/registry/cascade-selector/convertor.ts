export interface CascadeConfig {
  title: string;
  description?: string;
  placeholder?: string;
  displayModifier: FormBuilder.DisplayModifier;
  valueSource: FormBuilder.ValueSource;
  customizedDataset?: FormBuilder.CascadeOption[];
  predefinedDataset?: string;
  showFullPath: boolean;
  dropdownStyle: 'cascade' | 'tree';
  required: boolean;
}

export const defaultConfig: CascadeConfig = {
  title: '级联选择',
  description: '',
  placeholder: '',
  displayModifier: 'normal',
  valueSource: 'customized',
  customizedDataset: [],
  predefinedDataset: '',
  showFullPath: true,
  dropdownStyle: 'cascade',
  required: false,
};

export function toSchema(value: CascadeConfig): FormBuilder.Schema {
  return {
    type: 'string',
    title: value.title,
    description: value.description,
    required: value.required,
    readOnly: value.displayModifier === 'readonly',
    display: value.displayModifier !== 'hidden',
    'x-component': 'CascadeSelector',
    ['x-component-props']: {
      expandTrigger: 'hover',
      placeholder: value.placeholder,
      options: value.customizedDataset,
    },
    ['x-internal']: {
      predefinedDataset: value.predefinedDataset,
      valueSource: value.valueSource,
      showFullPath: value.showFullPath,
      sortable: false,
      permission: 3,
    },
  };
}

export function toConfig(schema: FormBuilder.Schema): CascadeConfig {
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
    valueSource: schema['x-component-props']?.valueSource || '',
    customizedDataset: schema['x-component-props']?.customizedDataset || [],
    predefinedDataset: schema['x-component-props']?.predefinedDataset || '',
    showFullPath: schema['x-component-props']?.showFullPath || true,
    dropdownStyle: schema['x-component-props']?.dropdownStyle || 'cascade',
    required: !!schema.required,
  };
}

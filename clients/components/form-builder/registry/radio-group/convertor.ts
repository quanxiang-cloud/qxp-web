import { nanoid } from 'nanoid';

export interface RadioGroupConfig {
  title: string;
  description?: string;
  displayModifier: FormBuilder.DisplayModifier;
  optionsLayout: 'horizontal' | 'vertical';
  sortable: boolean;
  required: boolean;
  valueSource: FormBuilder.ValueSource;
  availableOptions: Array<{ label: string; value: any; title: string }>,
}

// just for type friendly
export const defaultConfig: RadioGroupConfig = {
  title: '单选框',
  description: '',
  optionsLayout: 'horizontal',
  displayModifier: 'normal',
  sortable: false,
  required: false,
  valueSource: 'customized',
  availableOptions: [
    { label: 'One', value: 'One', title: 'One' },
    { label: 'Two', value: 'Two', title: 'Two' },
    { label: 'Three', value: 'Three', title: 'Three' },
  ],
};

export function toSchema(value: typeof defaultConfig): FormBuilder.Schema {
  return {
    title: value.title,
    description: value.description,
    required: value.required,
    readOnly: value.displayModifier === 'readonly',
    display: value.displayModifier !== 'hidden',
    enum: value.availableOptions.map((option) => {
      return {
        ...option,
        value: nanoid(8),
        title: option.label,
        name: option.label,
      };
    }),
    'x-component': 'RadioGroup',
    // todo support optionsLayout
    ['x-component-props']: {
      name: value.title,
    },
    ['x-internal']: {
      sortable: value.sortable,
    },
  };
}

export function toConfig(schema: FormBuilder.Schema): RadioGroupConfig {
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
    // todo implement this
    optionsLayout: schema['x-component-props']?.layout as any,
    sortable: schema['x-internal']?.sortable,
    required: !!schema.required,
    // todo implement this
    valueSource: schema['x-internal']?.valueSource,
    // todo refactor this
    availableOptions: schema.enum as Array<{ label: string; value: any; title: string }> || [],
  };
}

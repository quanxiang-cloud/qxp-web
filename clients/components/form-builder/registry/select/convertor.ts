import { nanoid } from 'nanoid';

export interface SelectConfig {
  title: string;
  description?: string;
  displayModifier: FormBuilder.DisplayModifier;
  sortable: boolean;
  required: boolean;
  valueSource: FormBuilder.ValueSource;
  availableOptions: Array<{ label: string; value: any; title: string }>,
}

export const defaultConfig: SelectConfig = {
  title: '下拉框',
  description: '',
  displayModifier: 'normal',
  sortable: false,
  required: false,
  valueSource: 'customized',
  availableOptions: [
    { label: '选项一', value: '选项一', title: '选项一' },
    { label: '选项二', value: '选项二', title: '选项二' },
    { label: '选项三', value: '选项三', title: '选项三' },
  ],
};

export function toSchema(value: SelectConfig): FormBuilder.Schema {
  return {
    type: 'string',
    title: value.title,
    description: value.description,
    required: value.required,
    readOnly: value.displayModifier === 'readonly',
    display: value.displayModifier !== 'hidden',
    enum: (value.availableOptions || []).map((option) => {
      return {
        ...option,
        value: nanoid(8),
        title: option.label,
        name: option.label,
      };
    }),
    'x-component': 'Select',
    // todo support optionsLayout
    ['x-component-props']: { },
    ['x-internal']: {
      sortable: value.sortable,
      permission: 3,
    },
  };
}

export function toConfig(schema: FormBuilder.Schema): SelectConfig {
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
    sortable: !!schema['x-internal']?.sortable,
    required: !!schema.required,
    // todo implement this
    valueSource: 'customized',
    // todo refactor this
    availableOptions: schema.enum as Array<{ label: string; value: any; title: string }> || [],
  };
}

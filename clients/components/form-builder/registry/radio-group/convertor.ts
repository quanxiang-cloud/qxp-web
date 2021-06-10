import { generateRandomFormFieldID } from '../../utils';

export interface RadioGroupConfig {
  title: string;
  description?: string;
  displayModifier: FormBuilder.DisplayModifier;
  optionsLayout: 'horizontal' | 'vertical';
  sortable: boolean;
  required: boolean;
  defaultValueFrom: FormBuilder.DefaultValueFrom;
  availableOptions: Array<{ label: string; value: any; title: string }>,
}

export const defaultConfig: RadioGroupConfig = {
  title: '单选框',
  description: '',
  optionsLayout: 'horizontal',
  displayModifier: 'normal',
  sortable: false,
  required: false,
  defaultValueFrom: 'customized',
  availableOptions: [
    { label: '选项一', value: 'option_1', title: '选项一' },
    { label: '选项二', value: 'option_2', title: '选项二' },
    { label: '选项三', value: 'option_3', title: '选项三' },
  ],
};

export function toSchema(value: typeof defaultConfig): ISchema {
  return {
    type: 'string',
    title: value.title,
    description: value.description,
    required: value.required,
    readOnly: value.displayModifier === 'readonly',
    display: value.displayModifier !== 'hidden',
    enum: value.availableOptions.map((option) => {
      return {
        ...option,
        value: option.value || generateRandomFormFieldID(),
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
      permission: 3,
      defaultValueFrom: 'customized',
    },
  };
}

export function toConfig(schema: ISchema): RadioGroupConfig {
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
    sortable: !!schema['x-internal']?.sortable,
    required: !!schema.required,
    // todo implement this
    defaultValueFrom: schema['x-internal']?.defaultValueFrom || 'customized',
    // todo refactor this
    availableOptions: schema.enum as Array<{ label: string; value: any; title: string }> || [],
  };
}

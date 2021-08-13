import { generateRandomFormFieldID } from '../../utils';

export interface MultipleSelectConfig {
  title: string;
  description?: string;
  displayModifier: FormBuilder.DisplayModifier;
  sortable: boolean;
  required: boolean;
  defaultValueFrom: FormBuilder.DefaultValueFrom;
  datasetId: string;
  availableOptions: Array<{ label: string; value: any; title: string }>,
}
export const defaultConfig: MultipleSelectConfig = {
  title: '下拉复选框',
  description: '',
  displayModifier: 'normal',
  sortable: false,
  required: false,
  defaultValueFrom: 'customized',
  datasetId: '',
  availableOptions: [
    { label: '选项一', value: 'option_1', title: '选项一' },
    { label: '选项二', value: 'option_2', title: '选项二' },
    { label: '选项三', value: 'option_3', title: '选项三' },
  ],
};

export function toSchema(value: MultipleSelectConfig): ISchema {
  return {
    type: 'array',
    title: value.title,
    description: value.description,
    required: value.required,
    readOnly: value.displayModifier === 'readonly',
    display: value.displayModifier !== 'hidden',
    enum: (value.availableOptions || []).map((option) => {
      return {
        ...option,
        value: option.value || generateRandomFormFieldID(),
        title: option.label,
        name: option.label,
      };
    }),
    'x-component': 'MultipleSelect',
    // todo support optionsLayout
    ['x-component-props']: {
      datasetId: value.datasetId,
    },
    ['x-internal']: {
      sortable: value.sortable,
      permission: 3,
      defaultValueFrom: value.defaultValueFrom,
    },
  };
}

export function toConfig(schema: ISchema): MultipleSelectConfig {
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
    defaultValueFrom: schema['x-internal']?.defaultValueFrom || 'customized',
    datasetId: schema['x-component-props']?.datasetId,
    // todo refactor this
    availableOptions: schema.enum as Array<{ label: string; value: any; title: string }> || [],
  };
}

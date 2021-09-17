import { convertEnumsToLabels, getSchemaPermissionFromSchemaConfig } from '@c/form-builder/utils';

export interface CheckboxGroupConfig {
  title: string;
  description?: string;
  displayModifier: FormBuilder.DisplayModifier;
  optionsLayout: 'horizontal' | 'vertical';
  sortable: boolean;
  required: boolean;
  defaultValueFrom: FormBuilder.DefaultValueFrom;
  datasetId: string;
  availableOptions: string[],
}

export const defaultConfig: CheckboxGroupConfig = {
  title: '复选框',
  description: '',
  displayModifier: 'normal',
  optionsLayout: 'horizontal',
  sortable: false,
  required: false,
  defaultValueFrom: 'customized',
  datasetId: '',
  availableOptions: ['选项一', '选项二', '选项三'],
};

export function toSchema(value: CheckboxGroupConfig): ISchema {
  return {
    type: 'array',
    title: value.title,
    description: value.description,
    required: value.required,
    readOnly: value.displayModifier === 'readonly',
    display: value.displayModifier !== 'hidden',
    enum: value.availableOptions || [],
    'x-component': 'CheckboxGroup',
    // todo support optionsLayout
    ['x-component-props']: {
      mode: 'multiple',
      optionsLayout: value.optionsLayout,
      datasetId: value.datasetId,
    },
    ['x-internal']: {
      sortable: value.sortable,
      permission: getSchemaPermissionFromSchemaConfig(value),
      defaultValueFrom: value.defaultValueFrom,
    },
  };
}

export function toConfig(schema: ISchema): CheckboxGroupConfig {
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
    optionsLayout: schema['x-component-props']?.layout as any,
    sortable: !!schema['x-internal']?.sortable,
    required: !!schema.required,
    defaultValueFrom: schema['x-internal']?.defaultValueFrom || 'customized',
    datasetId: schema['x-component-props']?.datasetId,
    availableOptions: convertEnumsToLabels(schema.enum as Array<string | LabelValue>),
  };
}

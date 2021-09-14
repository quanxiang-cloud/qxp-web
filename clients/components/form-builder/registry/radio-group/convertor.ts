import { convertEnumsToLabels, getSchemaPermissionFromSchemaConfig } from '@c/form-builder/utils';

export interface RadioGroupConfig {
  title: string;
  description?: string;
  displayModifier: FormBuilder.DisplayModifier;
  optionsLayout: 'horizontal' | 'vertical';
  sortable: boolean;
  required: boolean;
  allowCustom: boolean;
  defaultValueFrom: FormBuilder.DefaultValueFrom;
  datasetId: string;
  availableOptions: string[],
}

export const defaultConfig: RadioGroupConfig = {
  title: '单选框',
  description: '',
  optionsLayout: 'horizontal',
  displayModifier: 'normal',
  sortable: false,
  required: false,
  allowCustom: false,
  defaultValueFrom: 'customized',
  datasetId: '',
  availableOptions: ['选项一', '选项二', '选项三'],
};

export function toSchema(value: typeof defaultConfig): ISchema {
  return {
    type: 'string',
    title: value.title,
    description: value.description,
    required: value.required,
    readOnly: value.displayModifier === 'readonly',
    display: value.displayModifier !== 'hidden',
    enum: value.availableOptions || [],
    'x-component': 'RadioGroup',
    // todo support optionsLayout
    ['x-component-props']: {
      name: value.title,
      allowCustom: value.allowCustom,
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
    optionsLayout: schema['x-component-props']?.optionsLayout as any,
    sortable: !!schema['x-internal']?.sortable,
    required: !!schema.required,
    allowCustom: schema['x-component-props']?.allowCustom,
    defaultValueFrom: schema['x-internal']?.defaultValueFrom || 'customized',
    datasetId: schema['x-component-props']?.datasetId,
    availableOptions: convertEnumsToLabels(schema.enum as Array<string | LabelValue>),
  };
}

import {
  getDisplayModifierFromSchema,
  convertMultipleSelectDefaults,
  getSchemaPermissionFromSchemaConfig,
} from '@c/form-builder/utils';

export interface CheckboxGroupConfig {
  title: string;
  description?: string;
  displayModifier: FormBuilder.DisplayModifier;
  optionsLayout: 'horizontal' | 'vertical';
  sortable: boolean;
  required: boolean;
  allowCustom: boolean;
  defaultValueFrom: FormBuilder.DefaultValueFrom;
  datasetId: string;
  availableOptions: Array<Record<string, string | boolean>>,
  defaultValue: undefined | string,
}

export const defaultConfig: CheckboxGroupConfig = {
  title: '复选框',
  description: '',
  displayModifier: 'normal',
  optionsLayout: 'horizontal',
  sortable: false,
  required: false,
  allowCustom: false,
  defaultValueFrom: 'customized',
  datasetId: '',
  availableOptions: [
    { label: '选项一', isDefault: false },
    { label: '选项二', isDefault: false },
    { label: '选项三', isDefault: false },
  ],
  defaultValue: undefined,
};

export function toSchema(value: CheckboxGroupConfig): ISchema {
  return {
    type: 'array',
    title: value.title,
    description: value.description,
    required: value.required,
    readOnly: value.displayModifier === 'readonly',
    display: value.displayModifier !== 'hidden',
    default: value.defaultValueFrom === 'dataset' ?
      value.defaultValue : convertMultipleSelectDefaults(value.availableOptions),
    enum: value.availableOptions.map((op) => {
      return op.label as string;
    }) || [],
    'x-component': 'CheckboxGroup',
    // todo support optionsLayout
    ['x-component-props']: {
      mode: 'multiple',
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

export function toConfig(schema: ISchema): CheckboxGroupConfig {
  return {
    title: schema.title as string,
    description: schema.description as string,
    displayModifier: getDisplayModifierFromSchema(schema),
    optionsLayout: schema['x-component-props']?.optionsLayout,
    sortable: !!schema['x-internal']?.sortable,
    required: !!schema.required,
    allowCustom: schema['x-component-props']?.allowCustom,
    defaultValueFrom: schema['x-internal']?.defaultValueFrom || 'customized',
    datasetId: schema['x-component-props']?.datasetId,
    availableOptions: schema.enum?.map((label) => {
      return {
        label: label,
        isDefault: (!schema.default || !schema.default.length) ? false : schema.default.includes(label),
      };
    }) as any,
    defaultValue: schema.default,
  };
}

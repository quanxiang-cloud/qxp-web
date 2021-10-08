import {
  convertSingleSelectDefault,
  getDisplayModifierFromSchema,
  getSchemaPermissionFromSchemaConfig,
} from '@c/form-builder/utils';

export interface SelectConfig {
  title: string;
  description?: string;
  displayModifier: FormBuilder.DisplayModifier;
  sortable: boolean;
  required: boolean;
  allowCustom: boolean;
  defaultValueFrom: FormBuilder.DefaultValueFrom;
  datasetId: string;
  availableOptions: Array<Record<string, string | boolean>>,
}

export const defaultConfig: SelectConfig = {
  title: '下拉框',
  description: '',
  displayModifier: 'normal',
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
};

export function toSchema(value: SelectConfig): ISchema {
  return {
    type: 'string',
    title: value.title,
    description: value.description,
    required: value.required,
    readOnly: value.displayModifier === 'readonly',
    display: value.displayModifier !== 'hidden',
    default: convertSingleSelectDefault(value.availableOptions.find(({ isDefault }) => isDefault) || {}),
    enum: value.availableOptions.map((op) => {
      return op.label as string;
    }) || [],
    'x-component': 'Select',
    // todo support optionsLayout
    ['x-component-props']: {
      allowCustom: value.allowCustom,
      datasetId: value.datasetId,
    },
    ['x-internal']: {
      sortable: value.sortable,
      permission: getSchemaPermissionFromSchemaConfig(value),
      defaultValueFrom: value.defaultValueFrom,
    },
  };
}

export function toConfig(schema: ISchema): SelectConfig {
  return {
    title: schema.title as string,
    description: schema.description as string,
    displayModifier: getDisplayModifierFromSchema(schema),
    sortable: !!schema['x-internal']?.sortable,
    required: !!schema.required,
    allowCustom: schema['x-component-props']?.allowCustom,
    defaultValueFrom: schema['x-internal']?.defaultValueFrom || 'customized',
    datasetId: schema['x-component-props']?.datasetId,
    availableOptions: schema.enum?.map((label) => {
      return {
        label: label,
        isDefault: label === schema.default,
      };
    }) as any,
  };
}

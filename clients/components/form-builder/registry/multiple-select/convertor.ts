import {
  getDisplayModifierFromSchema,
  convertMultipleSelectDefaults,
  getSchemaPermissionFromSchemaConfig,
} from '@c/form-builder/utils';

export interface MultipleSelectConfig {
  title: string;
  description?: string;
  displayModifier: FormBuilder.DisplayModifier;
  sortable: boolean;
  required: boolean;
  allowCustom: boolean;
  defaultValueFrom: FormBuilder.DefaultValueFrom;
  datasetId: string;
  formApi: string[];
  sendUserData: boolean;
  availableOptions: Array<Record<string, string | boolean>>,
  defaultValue: undefined | string,
}

export const defaultConfig: MultipleSelectConfig = {
  title: '下拉复选框',
  description: '',
  displayModifier: 'normal',
  sortable: false,
  required: false,
  allowCustom: false,
  defaultValueFrom: 'customized',
  datasetId: '',
  formApi: [],
  sendUserData: false,
  availableOptions: [
    { label: '选项一', isDefault: false },
    { label: '选项二', isDefault: false },
    { label: '选项三', isDefault: false },
  ],
  defaultValue: undefined,
};

export function toSchema(value: MultipleSelectConfig): ISchema {
  return {
    type: 'array',
    title: value.title,
    description: value.description,
    required: value.required,
    readOnly: value.displayModifier === 'readonly',
    display: value.displayModifier !== 'hidden',
    default: value.defaultValueFrom === 'dataset' ? value.defaultValue :
      convertMultipleSelectDefaults(value.availableOptions),
    enum: value.availableOptions.map((op) => {
      return op.label as string;
    }) || [],
    'x-component': 'MultipleSelect',
    // todo support optionsLayout
    ['x-component-props']: {
      datasetId: value.datasetId,
      allowCustom: value.allowCustom,
      formApi: value.formApi,
      sendUserData: value.sendUserData,
    },
    ['x-internal']: {
      sortable: value.sortable,
      permission: getSchemaPermissionFromSchemaConfig(value),
      defaultValueFrom: value.defaultValueFrom,
    },
  };
}

export function toConfig(schema: ISchema): MultipleSelectConfig {
  return {
    title: schema.title as string,
    description: schema.description as string,
    displayModifier: getDisplayModifierFromSchema(schema),
    sortable: !!schema['x-internal']?.sortable,
    required: !!schema.required,
    allowCustom: schema['x-component-props']?.allowCustom,
    defaultValueFrom: schema['x-internal']?.defaultValueFrom || 'customized',
    datasetId: schema['x-component-props']?.datasetId,
    formApi: schema['x-component-props']?.formApi,
    sendUserData: schema['x-component-props']?.sendUserData,
    availableOptions: schema.enum?.map((label) => {
      return {
        label: label,
        isDefault: (!schema.default || !schema.default.length) ? false : schema.default.includes(label),
      };
    }) as any,
    defaultValue: schema.default,
  };
}

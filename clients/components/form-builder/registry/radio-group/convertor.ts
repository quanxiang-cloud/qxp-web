import {
  convertSingleSelectDefault,
  getDisplayModifierFromSchema,
  getSchemaPermissionFromSchemaConfig,
} from '@c/form-builder/utils';

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
  formApi: string[];
  sendUserData: boolean;
  availableOptions: Array<Record<string, string | boolean>>,
  defaultValue: undefined | string,
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
  formApi: [],
  sendUserData: false,
  availableOptions: [
    { label: '选项一', isDefault: false },
    { label: '选项二', isDefault: false },
    { label: '选项三', isDefault: false },
  ],
  defaultValue: undefined,
};

export function toSchema(value: typeof defaultConfig): ISchema {
  return {
    type: 'string',
    title: value.title,
    description: value.description,
    required: value.required,
    readOnly: value.displayModifier === 'readonly',
    display: value.displayModifier !== 'hidden',
    default: value.defaultValueFrom === 'dataset' ? value.defaultValue :
      convertSingleSelectDefault(value.availableOptions.find(({ isDefault }) => isDefault) || {}),
    enum: value.availableOptions.map((op) => {
      return op.label as string;
    }) || [],
    'x-component': 'RadioGroup',
    // todo support optionsLayout
    ['x-component-props']: {
      name: value.title,
      allowCustom: value.allowCustom,
      optionsLayout: value.optionsLayout,
      datasetId: value.datasetId,
      formApi: value.formApi,
      sendUserData: value.sendUserData,
      defaultValue: value.defaultValue,
    },
    ['x-internal']: {
      sortable: value.sortable,
      permission: getSchemaPermissionFromSchemaConfig(value),
      defaultValueFrom: value.defaultValueFrom,
    },
  };
}

export function toConfig(schema: ISchema): RadioGroupConfig {
  return {
    title: schema.title as string,
    description: schema.description as string,
    displayModifier: getDisplayModifierFromSchema(schema),
    optionsLayout: schema['x-component-props']?.optionsLayout as any,
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
        isDefault: label === schema.default,
      };
    }) as any,
    defaultValue: schema.default,
  };
}

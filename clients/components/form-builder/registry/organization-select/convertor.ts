import { getDisplayModifierFromSchema, getSchemaPermissionFromSchemaConfig } from '@c/form-builder/utils';

export interface DefaultConfig {
  title: string;
  description?: string;
  displayModifier: FormBuilder.DisplayModifier;
  placeholder?: string;
  required: boolean;
  multiple?: boolean;
  rangeList: LabelValue[];
  optionalRange?: 'all' | 'customize' | 'currentUserDep';
  defaultRange?: 'customize' | 'currentUserDep',
  defaultValues?: string[];
  type: string;
  appID?: string;
}

export const defaultConfig: DefaultConfig = {
  type: 'array',
  title: '部门选择器',
  description: '',
  displayModifier: 'normal',
  placeholder: '',
  required: false,
  multiple: false,
  rangeList: [],
  optionalRange: 'all',
  defaultRange: 'customize',
  defaultValues: [],
};

export const toSchema = (config: DefaultConfig): ISchema => {
  return Object.assign({}, config, {
    type: 'array',
    title: config.title,
    description: config.description,
    required: config.required,
    readOnly: config.displayModifier === 'readonly',
    display: config.displayModifier !== 'hidden',
    rangeList: config.rangeList,
    'x-component': 'OrganizationPicker',
    ['x-component-props']: {
      placeholder: config.placeholder,
      appID: config.appID || '',
      multiple: config.multiple,
      optionalRange: config.optionalRange,
      rangeList: config.rangeList,
      defaultRange: config.defaultRange,
      defaultValues: config.defaultValues,
    },
    ['x-internal']: {
      permission: getSchemaPermissionFromSchemaConfig(config),
    },
  });
};

export const toConfig = (schema: ISchema): DefaultConfig => {
  return {
    type: 'array',
    title: schema.title as string,
    description: schema.description as string,
    displayModifier: getDisplayModifierFromSchema(schema),
    placeholder: schema['x-component-props']?.placeholder || '',
    required: !!schema.required,
    defaultValues: schema['x-component-props']?.defaultValues || [],
    rangeList: schema['x-component-props']?.rangeList || [],
    multiple: schema['x-component-props']?.multiple,
    optionalRange: schema['x-component-props']?.optionalRange,
    defaultRange: schema['x-component-props']?.defaultRange,
    appID: schema['x-component-props']?.appID,
  };
};

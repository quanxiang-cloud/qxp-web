import { getSchemaPermissionFromSchemaConfig } from '@c/form-builder/utils';

export interface DefaultConfig {
  title: string;
  description?: string;
  displayModifier: FormBuilder.DisplayModifier;
  placeholder?: string;
  required: boolean;
  multiple?: boolean;
  rangeList: LabelValue[];
  optionalRange?: 'all' | 'customize';
  defaultRange?: 'customize' | 'myDep',
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
    },
    ['x-internal']: {
      multiple: config.multiple,
      optionalRange: config.optionalRange,
      rangeList: config.rangeList,
      defaultRange: config.defaultRange,
      defaultValues: config.defaultValues,
      permission: getSchemaPermissionFromSchemaConfig(config),
    },
  });
};

export const toConfig = (schema: ISchema): DefaultConfig => {
  let displayModifier: FormBuilder.DisplayModifier = 'normal';
  if (schema.readOnly) {
    displayModifier = 'readonly';
  } else if (!schema.display) {
    displayModifier = 'hidden';
  }

  return {
    type: 'array',
    title: schema.title as string,
    description: schema.description as string,
    displayModifier: displayModifier,
    placeholder: schema['x-component-props']?.placeholder || '',
    required: !!schema.required,
    defaultValues: schema['x-internal']?.defaultValues || [],
    rangeList: schema['x-internal']?.rangeList || [],
    multiple: schema['x-internal']?.multiple,
    optionalRange: schema['x-internal']?.optionalRange,
    defaultRange: schema['x-internal']?.defaultRange,
    appID: schema['x-component-props']?.appID,
  };
};

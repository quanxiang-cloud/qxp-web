import { getSchemaPermissionFromSchemaConfig, getDisplayModifierFromSchema } from '@c/form-builder/utils';

import { Option } from './messy/enum';

export interface DefaultConfig {
  title: string;
  description?: string;
  displayModifier: FormBuilder.DisplayModifier;
  placeholder?: string;
  required: boolean;
  defaultValue: string | string[];
  optionalRange?: 'all' | 'customize' | 'currentUser';
  defaultRange?: 'customize' | 'currentUser';
  multiple?: 'single' | 'multiple';
  rangeList: EmployeeOrDepartmentOfRole[];
  defaultValues?: string | string[];
  enums?: Option[];
  loading?: boolean;
  onSearch?: (value: string) => string | void;
  type: string;
  appID?: string;
}

export const defaultConfig: DefaultConfig = {
  title: '人员选择器',
  description: '',
  displayModifier: 'normal',
  placeholder: '',
  required: false,
  defaultValue: '',
  optionalRange: 'all',
  defaultRange: 'customize',
  multiple: 'single',
  rangeList: [],
  loading: false,
  type: 'array',
};

export const toSchema = (config: DefaultConfig): ISchema => {
  return Object.assign(config, {
    type: 'array',
    title: config.title,
    description: config.description,
    required: config.required,
    readOnly: config.displayModifier === 'readonly',
    display: config.displayModifier !== 'hidden',
    'x-component': 'UserPicker',
    ['x-component-props']: {
      placeholder: config.placeholder,
      mode: config.multiple,
      allowClear: true,
      appID: config.appID,
      showSearch: true,
      loading: config.loading,
      onSearch(value: string) {
        config.onSearch && config.onSearch(value);
      },

      filterOption: (input: string, option: Option) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
      },
    },
    ['x-internal']: {
      multiple: config.multiple,
      optionalRange: config.optionalRange,
      defaultRange: config.defaultRange,
      rangeList: config.rangeList,
      defaultValues: config.defaultValues,
      defaultValue: config.defaultValue,
      permission: getSchemaPermissionFromSchemaConfig(config),
    },
    enum: config.optionalRange === 'all' ? [] : (config.rangeList || []).map((itm) => ({
      label: itm.ownerName,
      value: itm.id,
      email: itm.email,
    })),
    defaultValues: config.defaultValues,
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
    defaultValue: schema['x-internal']?.defaultValue || [],
    defaultValues: schema['x-internal']?.defaultValues || [],
    rangeList: schema['x-internal']?.rangeList || [],
    multiple: schema['x-internal']?.multiple,
    optionalRange: schema['x-internal']?.optionalRange,
    defaultRange: schema['x-internal']?.defaultRange,
    appID: schema['x-component-props']?.appID,
  };
};

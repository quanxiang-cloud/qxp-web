import { Option } from './messy/enum';

export interface DefaultConfig {
  title: string;
  description?: string;
  displayModifier: FormBuilder.DisplayModifier;
  placeholder?: string;
  required: boolean;
  defaultValue: string | string[];
  optionalRange?: 'all' | 'customize' | 'myDep';
  multiple?: 'single' | 'multiple';
  rangeList: EmployeeOrDepartmentOfRole[];
  defaultValues: string | string[];
  enums?: Option[];
  loading?: boolean;
  onSearch?: (value: string) => string | void;
  type: string;
}

export const defaultConfig: DefaultConfig = {
  title: '人员选择器',
  description: '',
  displayModifier: 'normal',
  placeholder: '',
  required: false,
  defaultValue: '',
  optionalRange: 'all',
  multiple: 'single',
  rangeList: [],
  defaultValues: [],
  loading: false,
  type: 'array',
};

export const toSchema = (config: DefaultConfig): ISchema => {
  const { defaultValues } = config;
  const isMultiple = config.multiple === 'multiple';
  const isArr = Array.isArray(defaultValues);

  const multipleDefValues = isArr ? defaultValues : [defaultValues];
  const singleDefValues = isArr ? defaultValues[0] : defaultValues;
  const calcDefaultValues = isMultiple ? multipleDefValues : singleDefValues;

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
      showSearch: true,
      loading: config.loading,
      onSearch(value: string) {
        config.onSearch && config.onSearch(value);
      },

      filterOption: (input: string, option: Option) =>{
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
      },
    },
    ['x-internal']: {
      multiple: config.multiple,
      optionalRange: config.optionalRange,
      rangeList: config.rangeList,
      defaultValues: calcDefaultValues,
      defaultValue: config.defaultValue,
    },
    enum: config.optionalRange === 'all' ? [] : (config.rangeList || []).map((itm) => ({
      label: itm.ownerName,
      value: itm.id,
    })),
    defaultValues: calcDefaultValues,
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
    defaultValue: schema['x-internal']?.defaultValue || [],
    defaultValues: schema['x-internal']?.defaultValues || [],
    rangeList: schema['x-internal']?.rangeList || [],
    multiple: schema['x-internal']?.multiple,
    optionalRange: schema['x-internal']?.optionalRange,
  };
};

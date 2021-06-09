import { TreeNode } from 'react-dropdown-tree-select';
export interface DefaultConfig {
  title: string;
  description?: string;
  displayModifier: FormBuilder.DisplayModifier;
  placeholder?: string;
  required: boolean;
  multiple?: 'signle' | 'multiple';
  rangeList: TreeNode[];
  optionalRange?: 'all' | 'customize' | 'myDep';
  defaultValues?: string[];
  type: string;
}

export const defaultConfig: DefaultConfig = {
  type: 'label-value',
  title: '部门选择器',
  description: '',
  displayModifier: 'normal',
  placeholder: '',
  required: false,
  multiple: 'signle',
  rangeList: [],
  optionalRange: 'all',
  defaultValues: [],
};

export const toSchema = (config: DefaultConfig): FormBuilder.Schema => {
  return Object.assign(config, {
    type: 'label-value',
    title: config.title,
    description: config.description,
    required: config.required,
    readOnly: config.displayModifier === 'readonly',
    display: config.displayModifier !== 'hidden',
    rangeList: config.rangeList,
    'x-component': 'OrganizationPicker',
    ['x-component-props']: {
      placeholder: config.placeholder,
    },
    ['x-internal']: {
      multiple: config.multiple,
      optionalRange: config.optionalRange,
      rangeList: config.rangeList,
      defaultValues: config.defaultValues
    },
  });
};

export const toConfig = (schema: FormBuilder.Schema): DefaultConfig => {
  let displayModifier: FormBuilder.DisplayModifier = 'normal';
  if (schema.readOnly) {
    displayModifier = 'readonly';
  } else if (!schema.display) {
    displayModifier = 'hidden';
  }

  return {
    type: 'label-value',
    title: schema.title as string,
    description: schema.description as string,
    displayModifier: displayModifier,
    placeholder: schema['x-component-props']?.placeholder || '',
    required: !!schema.required,
    defaultValues: schema['x-internal']?.defaultValues || [],
    rangeList: schema['x-internal']?.rangeList || [],
    multiple: schema['x-internal']?.multiple,
    optionalRange: schema['x-internal']?.optionalRange,
  };
};

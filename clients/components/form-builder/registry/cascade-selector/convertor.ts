import { getSchemaPermissionFromSchemaConfig, getDisplayModifierFromSchema } from '@c/form-builder/utils';

export interface CascadeConfig {
  title: string;
  description?: string;
  placeholder?: string;
  displayModifier: FormBuilder.DisplayModifier;
  defaultValueFrom: FormBuilder.DefaultValueFrom;
  customizedDataset?: FormBuilder.CascadeOption[];
  predefinedDataset?: string; // dataset id
  showFullPath: boolean;
  dropdownStyle: 'cascade' | 'tree';
  required: boolean;
}

export const defaultConfig: CascadeConfig = {
  title: '级联选择',
  description: '',
  placeholder: '',
  displayModifier: 'normal',
  defaultValueFrom: 'customized',
  customizedDataset: [],
  predefinedDataset: '',
  showFullPath: true,
  dropdownStyle: 'cascade',
  required: false,
};

export function toSchema(value: CascadeConfig): ISchema {
  const { defaultValueFrom, customizedDataset } = value;

  return {
    type: 'label-value',
    title: value.title,
    description: value.description,
    required: value.required,
    readOnly: value.displayModifier === 'readonly',
    display: value.displayModifier !== 'hidden',
    'x-component': 'CascadeSelector',
    ['x-component-props']: {
      expandTrigger: 'hover',
      placeholder: value.placeholder,
      predefinedDataset: value.predefinedDataset,
      showFullPath: value.showFullPath,
      dropdownStyle: value.dropdownStyle,
      required: value.required,
      options: defaultValueFrom === 'customized' ? customizedDataset : [],
    },
    ['x-internal']: {
      defaultValueFrom: value.defaultValueFrom,
      sortable: false,
      permission: getSchemaPermissionFromSchemaConfig(value),
    },
  };
}

export function toConfig(schema: ISchema): CascadeConfig {
  return {
    title: schema.title as string,
    description: schema.description as string,
    displayModifier: getDisplayModifierFromSchema(schema),
    placeholder: schema['x-component-props']?.placeholder || '',
    defaultValueFrom: schema['x-internal']?.defaultValueFrom || 'customized',
    customizedDataset: schema['x-component-props']?.options || [],
    predefinedDataset: schema['x-component-props']?.predefinedDataset || '',
    showFullPath: schema['x-component-props']?.showFullPath || true,
    dropdownStyle: schema['x-component-props']?.dropdownStyle || 'cascade',
    required: !!schema.required,
  };
}

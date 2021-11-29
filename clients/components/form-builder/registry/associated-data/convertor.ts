import { getDisplayModifierFromSchema, getSchemaPermissionFromSchemaConfig } from '@c/form-builder/utils';

export interface AssociatedDataConfig {
  title: string;
  description?: string;
  displayModifier: FormBuilder.DisplayModifier;
  appID: string;
  associationTableID: string | undefined;
  fieldName: string;
  required: boolean;
  placeholder: string;
  filterConfig?: FilterConfig;
  associativeConfig?: Record<string, Array<FormBuilder.DataAssignment>>;
}

export const defaultConfig: AssociatedDataConfig = {
  title: '关联数据',
  placeholder: '选择关联数据',
  description: '',
  displayModifier: 'normal',
  associationTableID: undefined,
  appID: '',
  fieldName: '',
  required: false,
  associativeConfig: undefined,
};

export function toSchema(config: AssociatedDataConfig): ISchema {
  return {
    type: 'label-value',
    title: config.title,
    description: config.description,
    required: config.required,
    readOnly: config.displayModifier === 'readonly',
    display: config.displayModifier !== 'hidden',
    'x-component': 'AssociatedData',
    ['x-component-props']: {
      appID: config?.appID,
      fieldName: config.fieldName,
      associationTableID: config?.associationTableID,
      placeholder: config.placeholder,
      filterConfig: config.filterConfig || null,
      associativeConfig: config.associativeConfig,
    },
    ['x-internal']: {
      permission: getSchemaPermissionFromSchemaConfig(config),
    },
  };
}

export function toConfig(schema: ISchema): AssociatedDataConfig {
  return {
    title: schema.title as string,
    description: schema.description as string,
    displayModifier: getDisplayModifierFromSchema(schema),
    associationTableID: schema['x-component-props']?.associationTableID,
    fieldName: schema['x-component-props']?.fieldName,
    appID: schema['x-component-props']?.appID,
    placeholder: schema['x-component-props']?.placeholder || '选择关联数据',
    required: !!schema.required,
    filterConfig: schema['x-component-props']?.filterConfig || null,
    associativeConfig: schema['x-component-props']?.associativeConfig,
  };
}

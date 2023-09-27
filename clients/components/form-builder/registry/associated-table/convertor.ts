import { getDisplayModifierFromSchema, getSchemaPermissionFromSchemaConfig } from '@c/form-builder/utils';

export interface AssociatedTableConfig {
  title: string;
  description?: string;
  displayModifier: FormBuilder.DisplayModifier;
  linkedTable: {
    appID?: string;
    tableID: string;
    tableName: string;
    linkedTableField?: string;
    display?: boolean,

  } | undefined;
  defaultValue?: string;
}

export const defaultConfig: AssociatedTableConfig = {
  title: '关联列表',
  description: '',
  displayModifier: 'readonly',
  linkedTable: undefined,
  defaultValue: '查看关联列表',
};

export function toSchema(value: AssociatedTableConfig): ISchema {
  return {
    type: 'array',
    title: value.title,
    description: value.description,
    readOnly: value.displayModifier === 'readonly',
    display: value.displayModifier !== 'hidden',
    items: { type: 'string' },
    'x-component': 'AssociatedTable',
    ['x-component-props']: {
      appID: value?.linkedTable?.appID,
      tableID: value?.linkedTable?.tableID,
      tableName: value?.linkedTable?.tableName,
      linkedTableField: value?.linkedTable?.linkedTableField,
      defaultValue: value?.defaultValue,
      display: value.displayModifier !== 'hidden',
    },
    ['x-internal']: {
      permission: getSchemaPermissionFromSchemaConfig(value),
    },
  };
}

export function toConfig(schema: ISchema): AssociatedTableConfig {
  return {
    title: schema.title as string,
    description: schema.description as string,
    displayModifier: getDisplayModifierFromSchema(schema),
    linkedTable: {
      appID: schema['x-component-props']?.appID,
      tableID: schema['x-component-props']?.tableID,
      tableName: schema['x-component-props']?.tableName,
      linkedTableField: schema['x-component-props']?.linkedTableField,
      display: schema['x-component-props']?.display,
    },
    defaultValue: schema['x-component-props']?.defaultValue,
  };
}

import { get, pick, flatten, cloneDeep } from 'lodash';
import type { Properties } from '@lib/schema-convert';

const excludeComps = ['subtable'];

type TableListItem = {
  label: string;
  value: string;
  isGroup: boolean;
  children?: Array<TableListItem>
}

type Options = {
  noSystem?: boolean;
}

export const getSchemaFields = (schemaFields: SchemaField[] = [], options: Options = {}): LabelValue[] => {
  return schemaFields.filter((schema) => {
    const compName = schema.componentName;
    const isSystem = !!get(schema, 'x-internal.isSystem');
    if (options.noSystem && isSystem) {
      return false;
    }
    return compName && !excludeComps.includes(compName);
  }).map((schema) => {
    return { label: schema.title as string, value: schema.id };
  });
};

// filter target tables with group
export const filterTables = (tables: Array<TableListItem> = []): Array<TableListItem> => {
  const allTables = tables.map((tb) => {
    if (tb.isGroup) {
      return tb.children || [];
    }
    return tb;
  });
  return flatten(allTables);
};

const mapSchemaProps = <T extends SchemaField>(
  props: Record<string, T>,
  filterFn?: (v?: T) => boolean,
  mutateField?: (k: string, f: T, a: Record<string, T>) => void,
): Properties => {
  return Object.entries(props)
    .filter(([, field]) => {
      return filterFn ? filterFn(field) : true;
    })
    .reduce((acc: Record<string, any>, [key, field]: [string, T]) => {
      mutateField && mutateField(key, field, acc);
      return acc;
    }, {});
};

const getCompDefaultValFromData = (
  compName: string, mergeData: Record<string, any> = {}, valuePath: string,
): { default?: any; } => {
  const defaultVal: { default?: any } = {};
  if (mergeData[valuePath]?.valueFrom === 'fixedValue') {
    // fixme: valueOf is builtIn func
    const valueOf = typeof mergeData[valuePath]?.valueOf === 'function' ? '' : mergeData[valuePath]?.valueOf;
    Object.assign(defaultVal, { default: valueOf });
  }

  // todo: check field type, reset default value
  if (compName === 'imageupload') {
    if (!Array.isArray(defaultVal.default)) {
      defaultVal.default = [];
    }
  }
  return defaultVal;
};

type TransformSchemaSchema = { properties: Record<string, SchemaField> } & Omit<ISchema, 'properties'>

export const transformSchema = (
  schema: TransformSchemaSchema,
  options: { filterSubTable?: boolean } = {},
  mergeData: Record<string, any> = {},
): ISchema => {
  const mappedProps = mapSchemaProps(cloneDeep(schema).properties, (field) => {
    if (options.filterSubTable) {
      return field?.componentName === 'subtable';
    }
    return field?.componentName !== 'subtable';
  }, (key, field, acc) => {
    const innerFieldProps = pick(field, ['display', 'title', 'readonly', 'required', 'x-component', 'x-component-props']);
    const compName = field.componentName;

    if (compName === 'subtable') {
      const subProps = get(field, 'items.properties', {});
      const parentTableId = innerFieldProps?.['x-component-props']?.tableID;
      Object.assign(acc, {
        [key]: {
          type: 'object',
          'x-component': 'SubTableFields',
          'x-component-props': innerFieldProps,
          properties: mapSchemaProps(subProps,
            (f) => f?.componentName !== 'subtable',
            (subKey, field, acc) => {
              const curRules = get(mergeData, `${key}.createRules[0]`, {});
              const defaultVal = getCompDefaultValFromData(compName, curRules, subKey);
              Object.assign(acc, {
                [[key, subKey].join('@')]: {
                  type: 'object',
                  'x-component': 'CustomField',
                  'x-component-props': { ...field, parentTableId },
                  properties: {
                    [[key, subKey].join('@')]: { ...field, title: '', ...defaultVal },
                  },
                },
              });
            }),
        },
      });
    } else if (compName) {
      const defaultVal = getCompDefaultValFromData(compName, mergeData, key);
      Object.assign(acc, {
        [key]: {
          type: 'object',
          'x-component': 'CustomField',
          'x-component-props': innerFieldProps,
          properties: {
            [key]: { ...field, title: '', ...defaultVal }, // merge default value
          },
        },
      });
    }
    return;
  });

  return {
    ...schema,
    properties: mappedProps,
  };
};

export const getValidProcessVariables = (
  variables: Array<ProcessVariable>, compareType: string,
): (LabelValue | undefined)[] => {
  return variables?.map(({ code, name, fieldType }) => {
    if (fieldType === 'DATE' && compareType !== 'datepicker') {
      return;
    }
    if (fieldType === 'TEXT' && !['input', 'textarea'].includes(compareType)) {
      return;
    }
    if (fieldType === 'NUMBER' && compareType !== 'numberpicker') {
      return;
    }
    if (fieldType === 'BOOLEAN' && compareType !== 'radiogroup') {
      return;
    }
    return { label: name, value: code };
  }).filter(Boolean) || [];
};

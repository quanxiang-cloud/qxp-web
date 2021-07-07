import { get, pick, flatten } from 'lodash';

const excludeComps = ['SubTable'];

type TableListItem = {
  label: string;
  value: string;
  isGroup: boolean;
  children?: Array<TableListItem>
}

type Options = {
  noSystem?: boolean;
}

export const getSchemaFields = (schema: ISchema | undefined, options: Options = {}) => {
  return Object.entries(schema?.properties || {})
    .filter(([, field]) => {
      const compName = field['x-component'];
      const isSystem = !!get(field, 'x-internal.isSystem');
      if (options.noSystem && isSystem) {
        return false;
      }
      return compName && !excludeComps.includes(compName);
    })
    .map(([key, fieldSchema]) => {
      return { label: fieldSchema.title as string, value: key };
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

const mapSchemaProps = (props: { [k: string]: ISchema }, filterFn?: (v?: any) => boolean, mutateField?: (k: string, f: any, a: any) => void) => {
  return Object.entries(props)
    .filter(([, field]) => {
      return filterFn ? filterFn(field) : true;
    })
    .reduce((acc: Record<string, any>, [key, field]: [string, ISchema]) => {
      mutateField && mutateField(key, field, acc);
      return acc;
    }, {});
};

const getCompDefaultValFromData = (compName: string, mergeData: Record<string, any> = {}, valuePath: string) => {
  const defaultVal: { default?: any } = {};
  if (mergeData[valuePath]?.valueFrom === 'fixedValue') {
    // fixme: valueOf is builtIn func
    const valueOf = typeof mergeData[valuePath]?.valueOf === 'function' ? '' : mergeData[valuePath]?.valueOf;
    Object.assign(defaultVal, { default: valueOf });
  }

  // todo: check field type, reset default value
  if (compName === 'ImageUpload') {
    if (!Array.isArray(defaultVal.default)) {
      defaultVal.default = [];
    }
  }
  return defaultVal;
};

export const transformSchema = (schema: ISchema, options: { filterSubTable?: boolean } = {}, mergeData: Record<string, any> = {}): ISchema => {
  const properties = get(schema, 'properties', {});
  const mappedProps = mapSchemaProps(properties, (field) => {
    if (options.filterSubTable) {
      return field['x-component'] === 'SubTable';
    }
    return field['x-component'] !== 'SubTable';
  }, (key, field, acc) => {
    const innerFieldProps = pick(field, ['display', 'title', 'readonly', 'required', 'x-component-props']);
    const compName = field['x-component'];

    if (compName === 'SubTable') {
      const subProps = get(field, 'items.properties', {});
      const parentTableId = innerFieldProps['x-component-props'].tableID;
      Object.assign(acc, {
        [key]: {
          type: 'object',
          'x-component': 'SubTableFields',
          'x-component-props': innerFieldProps,
          properties: mapSchemaProps(subProps, (f) => f['x-component'] !== 'SubTable', (subKey, field, acc) => {
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
    } else {
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

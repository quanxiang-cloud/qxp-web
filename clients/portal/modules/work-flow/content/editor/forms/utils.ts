import { get, flatten, cloneDeep } from 'lodash';

export const primitiveTypes = ['string', 'number', 'boolean', 'datetime'];
export const advancedCompTypes = [
  'SubTable',
  'AssociatedRecords',
  'UserPicker',
  'OrganizationPicker',
  'FileUpload',
  'ImageUpload',
  'CascadeSelector',
  'AssociatedData',
];
export const excludeComps = ['subtable'];

type TableListItem = {
  label: string;
  value: string;
  isGroup: boolean;
  children?: Array<TableListItem>
}

type Options = {
  noSystem?: boolean;
  matchTypeFn?: (...args: any[])=> boolean;
  excludeComps?: string[],
  [key: string]: any,
}

export const getSchemaFields = (
  schemaFields: SchemaFieldItem[] = [],
  options: Options = {},
): LabelValue[] => {
  return schemaFields.filter((schema) => {
    const compName = schema.componentName;
    const isSystem = !!get(schema, 'x-internal.isSystem');
    if (options.noSystem && isSystem) {
      return false;
    }
    if ((options.excludeComps || excludeComps).includes(compName)) {
      return false;
    }
    if (options.matchTypeFn) {
      return options.matchTypeFn.call(null, schema);
    }
    return !!compName;
  }).map((schema) => {
    return { label: schema.title as string, value: schema.id };
  });
};

export function isAdvancedField(type: string, xCompName?: string): boolean {
  if (xCompName && advancedCompTypes.map((t)=> t.toLowerCase()).includes(xCompName.toLowerCase())) {
    return true;
  }
  return !primitiveTypes.includes(type);
}

export function isFieldTypeMatch(
  srcFieldType: string,
  srcFieldCompName: string,
  targetFieldSchema: ISchema,
): boolean {
  if (isAdvancedField(srcFieldType, srcFieldCompName)) {
    // advanced field should be the same component type
    return targetFieldSchema['x-component']?.toLowerCase() === srcFieldCompName.toLowerCase();
  }
  // primitive type should be equal
  return targetFieldSchema.type === srcFieldType;
}

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

const mapSchemaProps = <T extends SchemaFieldItem>(
  props: Record<string, T>,
  filterFn?: (v?: T) => boolean,
  mutateField?: (k: string, f: T, a: Record<string, T>) => void,
): Record<string, ISchema> => {
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

type TransformSchemaSchema = { properties: Record<string, SchemaFieldItem> } & Omit<ISchema, 'properties'>

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
    const innerFieldProps = cloneDeep(field);
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
): LabelValue[] => {
  return variables?.map(({ code, name, fieldType }) => {
    if (primitiveTypes.includes(fieldType) && fieldType === compareType) {
      return { label: name, value: code };
    }
  }).filter((v): v is LabelValue => !!v) || [];
};

/*
when compare field value in condition, value path should given
example:
```
{
  key: 'field_abc',
  value: [
    {
      value_prop: 'foo',
      label: 'bar'
    }
  ]
}
```
Then key should be changed to `field_abc.value_prop`
 */
const valuePathMap = {
  // AssociatedRecords: '', // string[]
  UserPicker: '[].value', // {label, value}[]
  OrganizationPicker: '[].value',
  FileUpload: '[].value',
  ImageUpload: '[].value',
  CascadeSelector: 'value',
  AssociatedData: 'value',
};

export function getFieldValuePath(fieldSchema?: ISchema): string {
  if (!fieldSchema) {
    return '';
  }
  return get(valuePathMap, fieldSchema['x-component'] || '', '');
}

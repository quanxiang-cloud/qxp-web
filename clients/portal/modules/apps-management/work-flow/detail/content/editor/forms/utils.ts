import { get, pick } from 'lodash';

const excludeComps = ['SubTable'];

export const getSchemaFields = (schema: ISchema | undefined) => Object.entries(schema?.properties || {})
  .filter(([, field]) => {
    const compName = field['x-component'];
    return compName && !excludeComps.includes(compName);
  })
  .map(([key, fieldSchema]) => {
    return { label: fieldSchema.title as string, value: key };
  });

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

export const transformSchema = (schema: ISchema, options: { filterSubTable?: boolean } = {}, mergeData: Record<string, any> = {}): ISchema => {
  const properties = get(schema, 'properties', {});
  const mappedProps = mapSchemaProps(properties, (field) => {
    if (options.filterSubTable) {
      return field['x-component'] === 'SubTable';
    }
    return field['x-component'] !== 'SubTable';
  }, (key, field, acc) => {
    const innerFieldProps = pick(field, ['display', 'title', 'readonly', 'required']);
    const compName = field['x-component'];

    if (compName === 'SubTable') {
      const subProps = get(field, 'items.properties', {});
      Object.assign(acc, {
        [key]: {
          type: 'object',
          'x-component': 'SubTableFields',
          'x-component-props': innerFieldProps,
          properties: mapSchemaProps(subProps, (f)=> f['x-component'] !== 'SubTable', (key, field, acc)=> {
            Object.assign(acc, {
              [key]: {
                type: 'object',
                'x-component': 'CustomField',
                'x-component-props': field,
                properties: {
                  [key]: { ...field, title: '' }, // todo: merge default value
                },
              },
            });
          }),
        },
      });
    } else {
      // fixme: valueOf is builtIn func
      const defaultVal: { default?: any } = {};
      if (mergeData[key]?.valueFrom === 'fixedValue') {
        const valueOf = typeof mergeData[key]?.valueOf === 'function' ? '' : mergeData[key]?.valueOf;
        Object.assign(defaultVal, { default: valueOf });
      }

      // todo: check field type, reset default value
      if (compName === 'ImageUpload') {
        if (!Array.isArray(defaultVal.default)) {
          defaultVal.default = [];
        }
      }

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

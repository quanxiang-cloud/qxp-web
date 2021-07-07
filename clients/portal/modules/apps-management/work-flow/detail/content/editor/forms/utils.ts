import { get, flatten } from 'lodash';

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


export type SubTableConfig = {
  title: string;
  description?: string;
  display?: FormBuilder.DisplayModifier;
  subordination: string;
  tableID: string;
  appID: string;
  items: ISchema;
  tableName: string;
  required: boolean;
  columns: {title: string; dataIndex: string}[];
}

export const defaultConfig: SubTableConfig = {
  title: '子表单',
  description: '子表单的描述内容',
  display: 'normal',
  subordination: 'foreign_table',
  tableID: '',
  appID: '',
  columns: [],
  items: {
    type: 'object',
    properties: {},
  },
  tableName: '',
  required: false,
};

export function toSchema(value: SubTableConfig): FormBuilder.Schema {
  // const entries = Object.entries(value.items?.properties || {});
  // let lastIndex = entries.length;

  // const entriesMap: [string, ISchema][] = entries.map(([key, value]) => {
  //   if (typeof value['x-index'] !== 'number') {
  //     const newEntry = [key, { ...value, ['x-index']: lastIndex }];
  //     lastIndex += 1;
  //     return newEntry as [string, ISchema];
  //   }
  //   return [key, value] as [string, ISchema];
  // });

  // const columns = entriesMap.sort((a, b) => {
  //   return Number(a[1]['x-index']) - Number(b[1]['x-index']);
  // }).reduce((cur: {title: string; dataIndex: string;}[], next) => {
  //   const [key, value] = next;
  //   cur.push({
  //     title: value.title as string || '',
  //     dataIndex: key,
  //   });
  //   return cur;
  // }, []);

  const schema = {
    type: 'array',
    title: value.title,
    description: value.description,
    required: value.required,
    readOnly: value.display === 'readonly',
    display: true,
    'x-component': 'SubTable',
    ['x-component-props']: {
      // columns: (columns.length ? columns : value?.columns).map((v) => JSON.stringify(v)),
      columns: (value.columns || []).map((v) => JSON.stringify(v)),
      subordination: value.subordination,
      appID: value.appID,
      tableID: value.tableID,
      tableName: value.tableName,
    },
    ['x-internal']: {
      permission: 3,
      sortable: false,
    },
  };

  if (value.subordination !== 'foreign_table') {
    Object.assign(schema, {
      items: value.items,
    });
  }
  return schema;
}

export function toConfig(schema: FormBuilder.Schema): SubTableConfig {
  let display: FormBuilder.DisplayModifier = 'normal';
  if (schema.readOnly) {
    display = 'readonly';
  } else if (!schema.display) {
    display = 'hidden';
  }

  return {
    title: schema.title as string,
    description: schema.description as string,
    display,
    subordination: schema?.['x-component-props']?.subordination,
    appID: schema?.['x-component-props']?.appID as string,
    tableID: schema?.['x-component-props']?.tableID as string,
    tableName: schema?.['x-component-props']?.tableName as string,
    columns: schema?.['x-component-props']?.columns.map(
      (v: string) => JSON.parse(v)
    ) as {title: string; dataIndex: string}[],
    items: schema.items as ISchema,
    required: !!schema.required,
  };
}

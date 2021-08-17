import { UnionColumns } from 'react-table';

export const SYSTEM_FIELDS: Record<string, ModelFieldSchema> = {
  _id: {
    type: 'string',
    title: 'id',
    readOnly: false,
    display: false,
    'x-component': 'Input',
    not_null: false,
    'x-internal': { isSystem: true },
    'x-index': 0,
  },
  created_at: {
    type: 'datetime',
    title: '创建时间',
    readOnly: false,
    display: false,
    'x-component': 'DatePicker',
    not_null: false,
    'x-component-props': { isNow: false, showTime: false },
    'x-internal': { isSystem: true },
    'x-index': 0,
  },
  updated_at: {
    type: 'datetime',
    title: '修改时间',
    readOnly: false,
    display: false,
    'x-component': 'DatePicker',
    not_null: false,
    'x-component-props': { isNow: false, showTime: false },
    'x-internal': { isSystem: true },
    'x-index': 0,
  },
  creator_name: {
    type: 'string',
    title: '创建者',
    readOnly: false,
    display: false,
    not_null: false,
    'x-component': 'Input',
    'x-internal': { isSystem: true },
    'x-index': 0,
  },
  creator_id: {
    type: 'string',
    title: '创建者 ID',
    readOnly: false,
    display: false,
    'x-component': 'Input',
    not_null: false,
    'x-internal': { isSystem: true },
    'x-index': 0,
  },
  modifier_name: {
    type: 'string',
    title: '修改者',
    readOnly: false,
    display: false,
    'x-component': 'Input',
    not_null: false,
    'x-internal': { isSystem: true },
    'x-index': 0,
  },
  modifier_id: {
    type: 'string',
    title: '修改者 ID',
    readOnly: false,
    display: false,
    'x-component': 'Input',
    not_null: false,
    'x-internal': { isSystem: true },
    'x-index': 0,
  },
};

export const FIELD_COLUMNS: UnionColumns<ModelField>[] = [
  {
    Header: '字段编码',
    id: 'id',
    accessor: 'id',
  },
  {
    Header: '字段名称',
    id: 'title',
    accessor: 'title',
  },
  {
    Header: '数据格式',
    id: 'type',
    accessor: 'type',
  },
  {
    Header: '是否允许为空',
    id: 'not_null',
    accessor: (rowData) => rowData.not_null ? '允许' : '不允许',
  },
];

export const INIT_MODEL_SCHEMA = {
  tableID: '',
  schema: {
    properties: SYSTEM_FIELDS,
    title: '',
    type: 'object',
    description: '',
  },
};

export function filterDeletedPage(
  groupID: string, pageID: string, pageList: PageInfo[],
): PageInfo[] {
  if (groupID === 'ROOT') {
    return pageList.filter((page) => page.id !== pageID);
  }

  return pageList.map((page) => {
    if (page.id === groupID) {
      page.child = page.child?.filter((childPage) => {
        return childPage.id !== pageID;
      });
      page.childCount = page.child?.length;
    }
    return page;
  });
}

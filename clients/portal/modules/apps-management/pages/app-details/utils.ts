import { UnionColumns } from 'react-table';

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
    properties: {},
    title: '',
    type: 'object',
    description: '',
  },
};

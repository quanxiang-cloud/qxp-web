import React from 'react';
import { UnionColumn } from 'react-table';

import Table from '@c/table';

import './index.css';

const config_schema = [
  {
    selector: '.qxp-table-th',
    desc: '表头样式',
  },
  {
    selector: '.qxp-table-td',
    desc: '表格内容单元格',
  },
];

export default {
  key: 'table',
  config_schema,
  Component: (): JSX.Element => {
    const columns: UnionColumn<any>[] = [
      {
        Header: '测试列1',
        id: 'test1',
        accessor: 'test1',
      },
      {
        Header: '测试列2',
        id: 'test2',
        accessor: 'test2',
      },
    ];

    const testTableData = [
      {
        id: 1,
        test1: '第一列第一行',
        test2: '第一列第二行',
      },
      {
        id: 1,
        test1: '第二列第一行',
        test2: '第二列第二行',
      },
    ];

    return (
      <Table rowKey='id' data={testTableData} columns={columns} />
    );
  },
};


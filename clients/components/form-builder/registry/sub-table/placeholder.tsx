import React from 'react';
import { UnionColumns } from 'react-table';

import Table from '@c/table';
import Empty from '@c/form-builder/components/empty';

type Props = Record<string, any>;

const EXCLUDE_FIELDS = ['_id'];
const DEFAULT_COL = [{
  id: '_op_',
  Header: '操作',
  accessor: () => <span className='cursor-pointer'>删除</span>,
}];

function Placeholder({ props }: Props): JSX.Element {
  const { items } = props;
  const cols: UnionColumns<any>[] = [];
  const properties = items?.properties || {};

  Object.entries(properties).forEach(([key, val]: [string, any]) => {
    if (EXCLUDE_FIELDS.includes(key)) return;
    cols.push({
      id: key,
      Header: val?.title || '',
      accessor: () => <Empty />,
    });
  });

  return (
    <Table columns={cols.concat(DEFAULT_COL)} data={[{ id: 'data' }]} rowKey='id' />
  );
}

export default Placeholder;

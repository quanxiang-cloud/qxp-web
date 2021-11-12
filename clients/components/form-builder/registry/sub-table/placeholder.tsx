import React, { useMemo } from 'react';
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
  const cols: UnionColumns<any>[] = useMemo(() => {
    const schema: ISchema = props?.items;
    return Object.entries(schema?.properties || {}).sort((a, b) => {
      return (a[1]?.['x-index'] || 0) - (b[1]?.['x-index'] || 0);
    }).reduce<UnionColumns<any>[]>((acc, [key, val]) => {
      if (!EXCLUDE_FIELDS.includes(key)) {
        return [...acc, {
          id: key,
          Header: val?.title || '',
          accessor: () => <Empty />,
        }];
      }

      return acc;
    }, []);
  }, [props?.items]);

  if (cols.length <= 0) {
    return <>暂无数据</>;
  }

  return (
    <Table
      columns={cols.concat(DEFAULT_COL)}
      data={[{ id: 'data' }]}
      rowKey='id'
    />
  );
}

export default Placeholder;

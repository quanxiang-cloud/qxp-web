import React, { useContext } from 'react';
import { Table } from 'antd';
import { ColumnType } from 'antd/lib/table';
import { observer } from 'mobx-react';

import { StoreContext } from './context';

function SubTable({ value, fieldKey }: {
  value: Record<string, unknown>[], fieldKey: string
}): JSX.Element | null {
  const store = useContext(StoreContext);

  if (!value) {
    return null;
  }

  function buildSubTableColumns(fieldKey: string): ColumnType<Record<string, any>>[] {
    const items = store.fields.find(({ id }) => id === fieldKey)?.items as ISchema;
    return Object.entries(items?.properties || {}).reduce((
      cur: ColumnType<Record<string, any>>[], next: [string, ISchema],
    ) => {
      const [key, sc] = next;
      if (key !== '_id') {
        cur.push({
          title: sc.title as string,
          dataIndex: key,
        });
      }
      return cur;
    }, []);
  }

  return (
    <Table
      pagination={false}
      rowKey="_id"
      columns={buildSubTableColumns(fieldKey) || []}
      dataSource={value}
    />
  );
}

export default observer(SubTable);

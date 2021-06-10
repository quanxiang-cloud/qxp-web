import React from 'react';
import { Table } from 'antd';
import { ColumnType } from 'antd/lib/table';
import { observer } from 'mobx-react';

function SubTable({ value, schema }: {
  value: Record<string, unknown>[];
  schema: ISchema;
}): JSX.Element | null {
  if (!value) {
    return null;
  }

  function buildSubTableColumns(): ColumnType<Record<string, any>>[] {
    return Object.entries(schema?.properties || {}).reduce((
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

  const columns = buildSubTableColumns();

  return (
    <Table
      pagination={false}
      rowKey="_id"
      columns={columns}
      dataSource={columns.length ? value : []}
    />
  );
}

export default observer(SubTable);

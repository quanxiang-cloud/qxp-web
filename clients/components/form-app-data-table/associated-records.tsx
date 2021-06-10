import React from 'react';
import { Table } from 'antd';
import { ColumnType } from 'antd/lib/table';
import { observer } from 'mobx-react';
import { useQuery } from 'react-query';

import Loading from '@c/loading';

import {
  findTableRecords,
} from '../form-builder/registry/associated-records/associated-records/api';

function AssociatedRecords({ schema, appID, tableID, selected }: {
  schema: ISchema;
  appID: string;
  tableID: string;
  selected: string[];
}): JSX.Element | null {
  const { isLoading, data } = useQuery(['FIND_TABLE_RECORDS'], () => {
    return findTableRecords(appID, tableID, selected);
  });

  if (isLoading || !data) {
    return <Loading desc="加载中..." />;
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
      dataSource={columns.length ? data : []}
    />
  );
}

export default observer(AssociatedRecords);

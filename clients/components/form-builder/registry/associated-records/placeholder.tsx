import React, { useState, useEffect, useCallback } from 'react';
import { UnionColumn } from 'react-table';

import Table from '@c/table';
import schemaToFields from '@lib/schema-convert';

import { getTableSchema } from '@lib/http-client-form';

const EXCLUDE_FIELDS = ['_id'];
const DEFAULT_COL = [{
  id: 'tool',
  Header: '操作',
  accessor: () => <span className='cursor-pointer'>删除</span>,
}];

function Placeholder({ props }: any): JSX.Element {
  const [cols, setCols] = useState([]);
  const { columns, appID, tableID } = props?.['x-component-props'] || {};

  const getTableData = useCallback(
    async (columns, appID, tableID): Promise<void> => {
      if (!tableID || !appID) return;

      getTableSchema(appID, tableID).then((res) => {
        if (!res) return;
        const flattenTableMap = schemaToFields(res.schema)
          ?.reduce((acc: Record<string, any>, { fieldName: key, title }) => {
            if (key && title) acc[key] = title as string;
            return acc;
          }, {});

        const availableCols = (columns || []).filter((v: string) => {
          return !EXCLUDE_FIELDS.includes(v) && flattenTableMap[v];
        });

        const _cols = availableCols?.reduce((acc: UnionColumn<any>[], id: string) => {
          acc.push({ id, Header: flattenTableMap[id], accessor: () => <span>--</span> });
          return acc;
        }, []);
        setCols(_cols.concat(DEFAULT_COL));
      });
    }, [],
  );

  useEffect(() => {
    getTableData(columns, appID, tableID);
  }, [appID, tableID, columns]);

  if (cols.length <= 0) {
    return <>无关联记录</>;
  }

  return (
    <Table
      rowKey='id'
      columns={cols}
      data={[{ id: 'data' }]}
    />
  );
}

export default Placeholder;

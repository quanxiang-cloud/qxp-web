import React, { useState } from 'react';
import { UnionColumns } from 'react-table';

import Button from '@c/button';
import Table from '@c/table';

interface Props {
  className?: string;
}

function ApiKeys(props: Props) {
  // todo
  const [loading, setLoading] = useState(false);
  const [apiKeys, setApiKeys] = useState([]);

  const COLS: UnionColumns<any>[] = [
    {
      Header: '密钥ID',
      id: 'id',
      accessor: 'id',
    },
    {
      Header: '描述',
      id: 'desc',
      accessor: 'desc',
    },
    {
      Header: '创建时间',
      id: 'create_time',
      accessor: 'create_time',
    },
    {
      Header: '状态',
      id: 'status',
      accessor: 'status',
    },
    {
      Header: '操作',
      id: '',
      accessor: '',
    },
  ];

  return (
    <div className='w-full'>
      <div className='flex items-center mb-8'>
        <Button modifier='primary'>新建密钥</Button>
      </div>
      <Table
        loading={loading}
        emptyTips='暂无数据'
        columns={COLS}
        data={apiKeys}
        rowKey='id'
      />
    </div>
  );
}

export default ApiKeys;

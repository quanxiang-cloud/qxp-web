import React from 'react';

import Table from '@c/table';

function PageFormTable() {
  const columns: any = [
    {
      Header: '工作表',
      id: 'name',
      accessor: 'name',
    },
    {
      Header: '操作权限',
      id: 'authorized',
      accessor: 'authorized',
    },
    {
      Header: '操作',
      id: 'id',
      accessor: (data:any) => {
        return (
          <span className='text-btn'>设置</span>
        );
      },
    },
  ];

  const data = [
    {
      id: '1',
      name: '测试',
      authorized: 11,
    },
  ];
  return (
    <div>
      <Table rowKey='id' data={data} columns={columns} />
    </div>
  );
}

export default PageFormTable;

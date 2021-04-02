import React from 'react';

import Button from '@c/button2';
import Table from '@c/table';

const columns = [
  {
    id: 'name',
    Header: '员工',
    fixed: true,
    accessor: ({ name }): JSX.Element => {
      return (
        <div>
          {name}
        </div>
      );
    },
  },
  {
    id: 'phone',
    Header: '手机号',
    accessor: 'phone',
  },
  {
    id: 'email',
    Header: '邮箱',
    accessor: 'email',
  },
  {
    id: 'dept',
    Header: '部门',
    accessor: 'dept',
  },
  {
    id: 'action',
    Header: '操作',
    accessor: (): JSX.Element => <span className='text-btn'>移除</span>,
  },
];

const data = [{
  id: '1',
  name: '张三',
  phone: '13355644556564',
  email: '384759564@qq.com',
  dept: '没有',
}];

function AppAdmin() {
  const handleSelectChange = (selectedArr)=>{
    console.log('selectedArr: ', selectedArr);
  };

  return (
    <div>
      <Button className='mb-20' isPrimary icon='add'>
        添加管理员
      </Button>
      <Table
        // offset={offset}
        // limit={limit}
        // total={total}
        showCheckBox
        columns={columns}
        data={data}
        onSelectChange={handleSelectChange}
        // loading={loading}
        // hasFilterParams={this.hasFilterParams}
        // onResetQuery={this.props.onResetQuery}
        // onPageChange={this.handlePageChange}
      />
    </div>
  );
}

export default AppAdmin;

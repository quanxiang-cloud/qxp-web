import React from 'react'
import { GridTable, Pagination } from '@QCFE/lego-ui';

const dataSource: any[] = [
  {
    name: '郭LILI',
    phone: '17617562233',
    email: 'Jackson@qxp.com',
    department: '运维一部',
    role: '普通管理员',
  },
  {
    name: '郭LILI2',
    phone: '17617562233',
    email: 'Jackson@qxp.com',
    department: '运维一部',
    role: '普通管理员',
  },
  {
    name: '郭LILI3',
    phone: '17617562233',
    email: 'Jackson@qxp.com',
    department: '运维一部',
    role: '普通管理员',
  },
];

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
  },
  {
    title: '手机号',
    dataIndex: 'phone',
  },
  {
    title: '邮箱',
    dataIndex: 'role',
    render: (field: any) => (field === 'available' ? '已启用' : '已弃用'),
  },
  {
    title: '部门',
    dataIndex: 'department',
  },
  {
    title: '角色',
    dataIndex: 'email',
  },
];


export const PersonInfo = () => {
  const pageSizeOptions = [10, 20, 50, 100];
  return (
    <div className="w-full mt-dot-8">
      <GridTable
        className="text-dot-7"
        dataSource={dataSource}
        columns={columns}
        rowKey="name"
        selectType="checkbox"
        // selectedRowKeys={selectedRowKeys}
        // disabledRowKeys={this.disabledRowKeys}
        // onSelect={this.onSelect}
      />
      <div className="flex items-center justify-between">
        <ul className="flex items-center">
          <li className="flex items-center">
            <img src="./dist/images/active.svg" className="p-x-0-dot-4" alt=""/>
            <div className="text-dot-7">活跃中：2</div>
          </li>
          <li className="flex items-center">
            <img src="./dist/images/disable.svg" className="p-x-0-dot-4" alt=""/>
            <div className="text-dot-7">已禁用：1</div>
          </li>
        </ul>
        <Pagination
          current={1}
          total={20}
          pageSize={10}
          pageSizeOptions={pageSizeOptions}
          // onChange={this.handleChange}
          // onShowSizeChange={this.handleShowSizeChange}
          type="simple"
        />
      </div>
    </div>
  )
}
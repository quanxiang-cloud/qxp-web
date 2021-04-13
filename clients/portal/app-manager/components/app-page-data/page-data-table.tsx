import React from 'react';

import Button from '@c/button';
import Icon from '@c/icon';
import Table from '@c/table/index';

const columns: any = [{
  id: 'userName',
  Header: '员工',
  accessor: 'userName',
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
  id: 'dep',
  Header: '部门',
  accessor: ({ dep }: Employee) => {
    return dep.departmentName || '未分配部门';
  },
},
{
  id: 'action',
  Header: '操作',
  accessor: ({ id }: any): JSX.Element =>
    <span className='text-btn'>移除</span>,
}];

const data = [
  {
    userName: '谭杰',
    phone: '133456564654',
    email: '38475@qq.cm',
    id: 1,
    dep: { departmentName: '研发部' },
  },
];

function PageDataTable() {
  const handleSelectChange = (selectArr: any) => {
    console.log('selectArr: ', selectArr);
  };

  const textBtnRender = (text: string, icon: string) => {
    return (
      <div className='inline-flex items-center cursor-pointer hover:text-blue-600'>
        <Icon size={20} className='mr-4 app-icon-color-inherit' name={icon} /> {text}
      </div>
    );
  };

  return (
    <div className='app-page-data-container flex-1'>
      <div className='mb-16 flex items-center gap-x-16'>
        <Button modifier='primary' iconName='add'>新建</Button>
        {textBtnRender('导入', 'file_download')}
        {textBtnRender('导出', 'file_upload')}
        {textBtnRender('删除', 'restore_from_trash')}
      </div>
      <Table showCheckBox onSelectChange={handleSelectChange} columns={columns} data={data} />
    </div>
  );
}

export default PageDataTable;

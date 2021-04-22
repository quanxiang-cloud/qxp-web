import React from 'react';

import Button from '@c/button';
import Icon from '@c/icon';
import Table from '@c/table';

type Props = {
  tableColumns: any[]
}

function PageDataTable({ tableColumns }: Props) {
  const handleSelectChange = (selectArr: any) => {
    console.log('selectArr: ', selectArr);
  };

  const textBtnRender = (text: string, icon: string) => {
    return (
      <div className='inline-flex items-center cursor-pointer hover:text-blue-600'>
        <Icon size={20} className='mr-4 app-icon-color-inherit' name={icon} />
        {text}
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
      <Table
        showCheckbox
        rowKey="id"
        onSelectChange={handleSelectChange}
        columns={tableColumns}
        data={[]}
      />
    </div>
  );
}

export default PageDataTable;

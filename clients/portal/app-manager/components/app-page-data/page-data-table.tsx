import React, { useMemo } from 'react';
import { observer } from 'mobx-react';

import Button from '@c/button';
import Icon from '@c/icon';
import Table from '@c/table';
import Pagination from '@c/pagination';

import store from './store';

function PageDataTable() {
  const columns = useMemo(()=>{
    return store.tableColumns.length ? [...store.tableColumns, {
      id: 'action',
      Header: '',
      accessor: (data: any) => {
        return (
          <div className='text-center'>
            <span className='mr-16 text-blue-600 cursor-pointer'>修改</span>
            <span className='text-red-600 cursor-pointer'>删除</span>
          </div>
        );
      },
    }] : store.tableColumns;
  }, [store.tableColumns]);

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
        {/* {textBtnRender('导入', 'file_download')}
        {textBtnRender('导出', 'file_upload')} */}
        {textBtnRender('删除', 'restore_from_trash')}
      </div>
      <Table
        showCheckbox
        emptyTips='暂无数据'
        rowKey="id"
        onSelectChange={handleSelectChange}
        columns={columns}
        data={[]}
      />
      {store.pageSize ? (
        <Pagination
          current={1}
          total={1}
          pageSize={store.pageSize}
          onChange={(page: number) => {
            console.log('page: ', page);
          }}
        />
      ) : null}
    </div>
  );
}

export default observer(PageDataTable);

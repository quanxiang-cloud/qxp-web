import React, { useMemo, useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import Button from '@c/button';
import Icon from '@c/icon';
import Table from '@c/table';
import Pagination from '@c/pagination';
import PopConfirm from '@c/pop-confirm';

import store from './store';

function PageDataTable() {
  const [selected, setSelected] = useState([]);
  const columns = useMemo(() => {
    return store.tableColumns.length ? [...store.tableColumns, {
      id: 'action',
      Header: '',
      accessor: (data: any) => {
        return (
          <div className='text-center'>
            <span
              onClick={() => store.goEdit(data)}
              className='mr-16 text-blue-600 cursor-pointer'
            >
              修改
            </span>
            <PopConfirm content='确认删除该数据？' onOk={() => store.delFormData([data._id])} >
              <span className='text-red-600 cursor-pointer'>删除</span>
            </PopConfirm>
          </div>
        );
      },
    }] : store.tableColumns;
  }, [store.tableColumns]);

  useEffect(() => {
    if (!store.allowRequestData) {
      return;
    }
    store.setParams({});
  }, [store.tableID]);

  const handleSelectChange = (selectArr: any) => {
    setSelected(selectArr);
  };

  const textBtnRender = (text: string, icon: string, onClick: () => void) => {
    return (
      <div
        onClick={onClick}
        className='inline-flex items-center cursor-pointer hover:text-blue-600'
      >
        <Icon size={20} className='mr-4 app-icon-color-inherit' name={icon} />
        {text}
      </div>
    );
  };

  return (
    <div className='app-page-data-container flex-1'>
      <div className='mb-16 flex items-center gap-x-16'>
        <Button onClick={store.createFun} modifier='primary' iconName='add'>新建</Button>
        {/* {textBtnRender('导入', 'file_download')}
        {textBtnRender('导出', 'file_upload')} */}
        {selected.length > 0 && textBtnRender('批量删除',
          'restore_from_trash',
          () => store.delFormData(selected)
        )}
      </div>
      <Table
        showCheckbox
        emptyTips='暂无数据'
        rowKey="_id"
        loading={store.listLoading}
        onSelectChange={handleSelectChange}
        columns={columns}
        data={store.formDataList}
      />
      {store.pageSize ? (
        <Pagination
          current={store.params.page}
          total={store.total}
          pageSize={store.params.size}
          onChange={(page: number, size: number) => {
            store.setParams({ page, size });
          }}
        />
      ) : null}
    </div>
  );
}

export default observer(PageDataTable);

import React, { useState, useRef } from 'react';
import { observer } from 'mobx-react';

import FormAppDataTable from '@c/form-app-data-table';
import { Ref, TableHeaderBtn } from '@c/form-app-data-table/type';
import PopConfirm from '@c/pop-confirm';
import PageLoading from '@c/page-loading';

import { getOperateButtonPer } from '../utils';
import CreateDataForm from './create-data-form';
import DetailsDrawer from './details-drawer';
import store from '../store';
import Header from '../header';

import './index.scss';

function PageDetails(): JSX.Element | null {
  const { fetchSchemeLoading } = store;
  const [modalType, setModalType] = useState('');
  const [curRowID, setCurRowID] = useState('');
  const formTableRef = useRef<Ref>(null);
  const BUTTON_GROUP: Record<number, TableHeaderBtn> = {
    2: {
      key: 'add',
      action: () => {
        store.operationType = '新建';
        goEdit('');
      },
      text: '新建',
      iconName: 'add',
    },
    4: {
      key: 'batchRemove',
      action: delFormData,
      text: '批量删除',
      iconName: 'restore_from_trash',
      type: 'popConfirm',
      isBatch: true,
      popText: '确认删除选择数据？',
    },
    5: {
      key: 'import',
      action: () => {},
      text: '导入',
      iconName: 'file_download',
    },
    6: {
      key: 'export',
      action: () => {},
      text: '导出',
      iconName: 'file_upload',
    },
  };

  function goEdit(rowID: string): void {
    setCurRowID(rowID);
    setModalType('dataForm');
  }

  function goView(rowID: string): void {
    setCurRowID(rowID);
    setModalType('details');
  }

  async function delFormData(ids: string[]): Promise<any> {
    await store.delFormData(ids);
    formTableRef.current?.refresh();
  }

  const tableHeaderBtnList: TableHeaderBtn[] =
  Object.entries(BUTTON_GROUP).reduce((acc: TableHeaderBtn[], [key, buttonValue]) => {
    if (getOperateButtonPer(Number(key), store.authority)) {
      return [...acc, buttonValue];
    }
    return acc;
  }, []);

  const customColumns = [{
    id: 'action',
    Header: '操作',
    fixed: true,
    accessor: (rowData: any) => {
      return (
        <div>
          {getOperateButtonPer(1, store.authority) && (
            <span
              onClick={() => {
                store.operationType = '查看';
                goView(rowData._id);
              }}
              className='mr-16 text-blue-600 cursor-pointer'
            >
              查看
            </span>
          )}
          {getOperateButtonPer(3, store.authority) && (
            <span
              onClick={() => {
                store.operationType = '修改';
                goEdit(rowData._id);
              }}
              className='mr-16 text-blue-600 cursor-pointer'
            >
              修改
            </span>
          )}
          {getOperateButtonPer(4, store.authority) && (
            <PopConfirm content='确认删除该数据？' onOk={() => delFormData([rowData._id])}>
              <span className='text-red-600 cursor-pointer'>删除</span>
            </PopConfirm>
          )}
        </div>

      );
    },
  }];

  const handleCancel = (isRefresh?: boolean): void => {
    setModalType('');
    setCurRowID('');
    store.operationType = '';
    if (isRefresh) {
      formTableRef.current?.refresh();
    }
  };

  const renderPageBody = (): JSX.Element => {
    if (fetchSchemeLoading) {
      return <PageLoading />;
    }

    return (
      <FormAppDataTable
        showCheckbox={getOperateButtonPer(4, store.authority)}
        ref={formTableRef}
        tableHeaderBtnList={tableHeaderBtnList}
        customColumns={customColumns}
        appID={store.appID}
        appName={store.appName}
        pageID={store.tableID}
        pageName={store.tableName}
        allowRequestData={true}
        className="p-20 h-full"
        style={{ display: modalType === 'dataForm' ? 'none' : 'flex' }}
      />
    );
  };

  return (
    <div className='overflow-auto'>
      <Header onCancel={() => handleCancel(true)} />
      <div className='main-content relative flex-1 overflow-hidden'>
        {renderPageBody()}
        {modalType === 'dataForm' && (
          <CreateDataForm
            appID={store.appID}
            pageID={store.tableID}
            title={store.tableName}
            rowID={curRowID}
            onCancel={() => handleCancel(true)}
          />
        )}
        {modalType === 'details' && (
          <DetailsDrawer
            delData={delFormData}
            goEdit={goEdit}
            rowID={curRowID}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
}

export default observer(PageDetails);

import React, { useState, useRef, useEffect } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';

import FormAppDataTable from '@c/form-app-data-table';
import { Ref, TableHeaderBtn } from '@c/form-app-data-table/type';
import PopConfirm from '@c/pop-confirm';
import PageLoading from '@c/page-loading';
import { MenuType } from '@portal/modules/apps-management/pages/app-details/type';

import { getOperateButtonPer } from '../utils';
import CreateDataForm from './create-data-form';
import DetailsDrawer from './details-drawer';
import store from '../store';
import Header from '../header';
import './index.scss';

function PageDetails(): JSX.Element | null {
  const { curPage, fetchSchemeLoading } = store;
  const [modalType, setModalType] = useState('');
  const [curRowID, setCurRowID] = useState('');
  const formTableRef = useRef<Ref>(null);

  useEffect(() => {
    handleCancel();
  }, [curPage]);

  const goEdit = (rowID: string): void => {
    setCurRowID(rowID);
    setModalType('dataForm');
  };

  const goView = (rowID: string): void => {
    setCurRowID(rowID);
    setModalType('details');
  };

  const delFormData = async (ids: string[]): Promise<any> => {
    await store.delFormData(ids);
    formTableRef.current?.refresh();
  };

  const tableHeaderBtnList: TableHeaderBtn[] = [];

  if (getOperateButtonPer(2, store.authority)) {
    tableHeaderBtnList.push({
      key: 'add',
      action: () => {
        store.operationType = '新建';
        goEdit('');
      },
      text: '新建',
      iconName: 'add',
    });
  }

  if (getOperateButtonPer(4, store.authority)) {
    tableHeaderBtnList.push({
      key: 'batchRemove',
      action: delFormData,
      text: '批量删除',
      iconName: 'restore_from_trash',
      type: 'popConfirm',
      isBatch: true,
      popText: '确认删除选择数据？',
    });
  }

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
    const { menuType } = curPage;
    if (menuType === MenuType.customPage) {
      return (
        <iframe
          className="w-full h-full"
          src={store.customPageInfo?.fileUrl}
          style={{ border: 'none' }}
        />
      );
    } else {
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
          pageID={store.pageID}
          allowRequestData={true}
          className={cs('p-20 h-full', { 'form-table-hidden': modalType === 'dataForm' })}
        />
      );
    }
  };

  if (!curPage.id) {
    return null;
  }

  return (
    <div className='flex-1 overflow-auto'>
      <Header onCancel={() => handleCancel(true)} />
      <div className='main-content relative flex-1 overflow-hidden'>
        {renderPageBody()}
        {modalType === 'dataForm' && (
          <CreateDataForm
            appID={store.appID}
            pageID={store.pageID}
            title={store.pageName}
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

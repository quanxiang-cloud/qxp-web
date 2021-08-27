import React, { useState, useRef, useEffect } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';

import TextHeader from '@c/text-header';
import FormAppDataTable from '@c/form-app-data-table';
import { Ref, TableHeaderBtn } from '@c/form-app-data-table/type';
import PopConfirm from '@c/pop-confirm';
import PageLoading from '@c/page-loading';
import { MenuType } from '@portal/modules/apps-management/pages/app-details/type';

import { getOperateButtonPer } from '../utils';
import CreateDataForm from './create-data-form';
import DetailsDrawer from './details-drawer';
import store from '../store';
import './index.scss';

function PageDetails(): JSX.Element | null {
  const { curPage, fetchSchemeLoading, formScheme } = store;
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

  const tableHeaderBtnList: TableHeaderBtn[] = [
    { key: 'add', action: () => goEdit(''), text: '新建', iconName: 'add' },
    {
      key: 'batchRemove',
      action: delFormData,
      text: '批量删除',
      iconName: 'restore_from_trash',
      type: 'popConfirm',
      isBatch: true,
      popText: '确认删除选择数据？',
    },
  ];

  const customColumns = [{
    id: 'action',
    Header: '操作',
    accessor: (rowData: any) => {
      return (
        <div>
          {getOperateButtonPer(1, store.authority) && (
            <span
              onClick={() => goView(rowData._id)}
              className='mr-16 text-blue-600 cursor-pointer'
            >
              查看
            </span>
          )}
          {getOperateButtonPer(3, store.authority) && (
            <span
              onClick={() => goEdit(rowData._id)}
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
    if (isRefresh) {
      formTableRef.current?.refresh();
    }
  };

  const renderPageBody = () => {
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
      if (formScheme) {
        return (
          <FormAppDataTable
            ref={formTableRef}
            tableHeaderBtnList={tableHeaderBtnList}
            customColumns={customColumns}
            appID={store.appID}
            pageID={store.pageID}
            allowRequestData={true}
            style={{ height: 'calc(100% - 62px)' }}
            className={cs('p-20', { 'form-table-hidden': modalType === 'dataForm' })}
          />
        );
      }
    }
  };

  if (!curPage.id) {
    return null;
  }

  return (
    <div className='relative h-full flex-1 overflow-hidden'>
      <TextHeader
        title={curPage.name || ''}
        desc={curPage.describe || ''}
        className="bg-white px-20 py-18 header-background-image"
        itemTitleClassName="text-h5" />
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
  );
}

export default observer(PageDetails);

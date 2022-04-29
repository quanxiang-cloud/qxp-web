import React, { useState, useRef, useEffect } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';

import FormAppDataTable from '@c/form-app-data-table';
import { useTaskComplete } from '@c/task-lists/utils';
import { Ref, TableHeaderBtn } from '@c/form-app-data-table/type';
import PopConfirm from '@c/pop-confirm';
import PageLoading from '@c/page-loading';
import toast from '@lib/toast';
import { MenuType } from '@portal/modules/apps-management/pages/app-details/type';
import ArteryPage from '@portal/modules/apps-management/pages/page-design/artery-page';

import { getAPIPath, getOperateButtonPer } from '../utils';
import CreateDataForm from './create-data-form';
import DetailsDrawer from './details-drawer';
import store from '../store';
import Header from '../header';

import './index.scss';

function PageDetails(): JSX.Element | null {
  const { appID, pageID, curPage, fetchSchemeLoading } = store;
  const [modalType, setModalType] = useState('');
  const [curRowID, setCurRowID] = useState('');
  const formTableRef = useRef<Ref>(null);
  const BUTTON_GROUP: Record<string, TableHeaderBtn> = {
    create: {
      key: 'add',
      action: () => {
        store.operationType = '新建';
        goEdit('');
      },
      text: '新建',
      iconName: 'add',
    },
    batchRemove: {
      key: 'batchRemove',
      action: delFormData,
      text: '批量删除',
      iconName: 'restore_from_trash',
      type: 'popConfirm',
      isBatch: true,
      popText: '确认删除选择数据？',
    },
    import: {
      key: 'import',
      action: () => {},
      text: '导入',
      iconName: 'file_download',
    },
    export: {
      key: 'export',
      action: () => {},
      text: '导出',
      iconName: 'file_upload',
    },
  };

  useEffect(() => {
    handleCancel();
  }, [curPage]);

  useEffect(() => {
    console.log(store.currentRoleInfo);
  }, [store.currentRoleInfo]);

  console.log(11);

  // useMemo(() => {
  //   console.log(store.currentRoleInfo);
  // }, [store.currentRoleInfo]);

  useTaskComplete('refresh-form-data-list', (socketData) => {
    if (socketData.content.command === 'formImport') {
      formTableRef.current?.refresh();
    }
  });

  function goEdit(rowID: string): void {
    setCurRowID(rowID);
    setModalType('dataForm');
  }

  function goView(rowID: string): void {
    setCurRowID(rowID);
    setModalType('details');
  }

  async function delFormData(ids: string[]): Promise<any> {
    await store.delFormData(ids)
      .then(() =>toast.success('删除成功'))
      .catch((err) => toast.error(err));
    formTableRef.current?.refresh();
  }

  const tableHeaderBtnList: TableHeaderBtn[] =
  Object.entries(BUTTON_GROUP).reduce((acc: TableHeaderBtn[], [key, buttonValue]) => {
    const _apiPath = getAPIPath(appID, pageID, key, 'POST');
    if (store.authority[_apiPath]) {
      return [...acc, buttonValue];
    }
    return acc;
  }, []);

  const customColumns = [{
    id: 'action',
    Header: '操作',
    fixed: true,
    accessor: (rowData: any) => {
      const perParams = { appID, tableID: pageID, authority: store.authority };
      return (
        <div>
          {getOperateButtonPer('get', perParams) && (
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
          {getOperateButtonPer('update', perParams) && (
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
          {getOperateButtonPer('delete', perParams) && (
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
    } else if (menuType === MenuType.arteryPage) {
      return (
        <ArteryPage arteryID={store.pageID} />
      );
    } else {
      if (fetchSchemeLoading) {
        return <PageLoading />;
      }

      return (
        <FormAppDataTable
          showCheckbox={
            getOperateButtonPer('batchRemove', { appID, tableID: pageID, authority: store.authority })
          }
          ref={formTableRef}
          tableHeaderBtnList={tableHeaderBtnList}
          customColumns={customColumns}
          appID={store.appID}
          appName={store.appName}
          pageID={store.pageID}
          pageName={store.pageName}
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

import React, { useMemo, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { Ref, TableHeaderBtn } from '@c/form-app-data-table/type';

import { QueryClient, QueryClientProvider } from 'react-query';
import { getOperateButtonPer } from './utils';
import PopConfirm from '@c/pop-confirm';
import CreateDataForm from './create-data-form';
import FormAppDataTable from '@c/form-app-data-table';
import Header from './header';
import DetailsDrawer from './details-drawer';
import useTableViewStore from './use-table-view-store';
import { toast } from '@one-for-all/ui';

export type Props = {
  appID: string;
  tableID: string;
  name: string;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function TableViewDetail({ appID, tableID, name }: Props): JSX.Element {
  const store = useTableViewStore({ appID, tableID, name });

  const { fetchSchemeLoading, setCurRowID } = store;
  const [modalType, setModalType] = useState('');

  const formTableRef = useRef<Ref>(null);

  const BUTTON_GROUP: Record<number, TableHeaderBtn> = useMemo(() => ({
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
  }), [store.operationType]);

  function goEdit(rowID: string): void {
    setCurRowID(rowID);
    setModalType('dataForm');
  }

  function goView(rowID: string): void {
    setCurRowID(rowID);
    setModalType('details');
  }

  function delFormData(ids: string[]): Promise<any> {
    return store.delFormData(ids).then((data: any) => {
      if (data.errorCount && data.errorCount === ids.length) {
        toast.error('删除失败！没有权限');
        return;
      }

      if (data.errorCount) {
        toast.success(`删除成功!,成功${ids.length - data.errorCount}条,失败${data.errorCount}条`);
        return;
      }

      toast.success('删除成功!');
    }).finally(() => {
      formTableRef.current?.refresh();
    });
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
    store.setOperationType('');
    if (isRefresh) {
      formTableRef.current?.refresh();
    }
  };

  const renderPageBody = (): JSX.Element => {
    // if (fetchSchemeLoading) {
    //   return <PageLoading />;
    // }

    return (
      <FormAppDataTable
        showCheckbox={getOperateButtonPer(4, store.authority)}
        ref={formTableRef}
        tableHeaderBtnList={tableHeaderBtnList}
        customColumns={customColumns}
        appID={store.appID}
        appName={''}
        pageID={store.tableID}
        pageName={store.tableName}
        allowRequestData={true}
        className="p-20 h-full"
        style={{ display: modalType === 'dataForm' ? 'none' : 'flex' }}
      />
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className='h-full'>
        <Header tableName={name} operationType={store.operationType} onCancel={() => handleCancel(true)} />
        <div style={{ maxHeight: 'calc(100% - 62px)' }} className='h-full relative overflow-hidden'>
          {renderPageBody()}
          {modalType === 'dataForm' && (
            <CreateDataForm
              appID={store.appID}
              pageID={store.tableID}
              title={store.tableName}
              rowID={store.curRowID}
              onCancel={() => handleCancel(true)}
            />
          )}
          {modalType === 'details' && (
            <DetailsDrawer
              delData={delFormData}
              goEdit={goEdit}
              rowID={store.curRowID}
              appID={appID}
              onCancel={handleCancel}
              tableID={tableID}
              tableName={name}
              authority={store.authority}
            />
          )}
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default observer(TableViewDetail);


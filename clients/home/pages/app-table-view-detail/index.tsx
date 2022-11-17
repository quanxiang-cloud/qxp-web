/* eslint-disable max-len */
/* eslint-disable no-case-declarations */
/* eslint-disable guard-for-in */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { Ref, TableHeaderBtn } from '@c/form-app-data-table/type';
import { QueryClient, QueryClientProvider } from 'react-query';

import PopConfirm from '@c/pop-confirm';
import FormAppDataTable from '@c/form-app-data-table';
import { toast } from '@one-for-all/ui';
import PageLoading from '@c/page-loading';
import userAppDetailsStore from '@home/pages/app-details/store';

import Header from './header';
import CreateDataForm from './create-data-form';
import DetailsDrawer from './details-drawer';
import useTableViewStore from './use-table-view-store';
import { getAPIPath, getOperateButtonPer } from './utils';
import { getApiPermit, getPolyapi, getSubordinate } from './api';

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

export const TableContext = React.createContext<Props>(
  { appID: 'noAppID', tableID: 'noTableID', name: 'noName' },
);

function TableViewDetail({ appID, tableID, name }: Props): JSX.Element {
  const store = useTableViewStore({ appID, tableID, name });
  const [polyapiList, setPolyapiList] = useState<any>([]);
  const [polyBtnObj, setPolyBtnObj] = useState<any>({});
  const [btnCondition, setBtnCondition] = useState<any>({});
  const [subordinateList, setSubordinateList] = useState<any>([]);
  const { fetchSchemeLoading, setCurRowID } = store;
  const [modalType, setModalType] = useState('');
  const [modalBtnAuth, setModalBtnAuth] = useState<any>();

  const formTableRef = useRef<Ref>(null);
  const btnConObj: any = {};

  const BUTTON_GROUP: Record<string, TableHeaderBtn> = {
    create: {
      key: 'create',
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
      action: () => { },
      text: '导入',
      iconName: 'file_download',
    },
    export: {
      key: 'export',
      action: () => { },
      text: '导出',
      iconName: 'file_upload',
    },
  };

  useEffect(() => {
    store.setCurRoleID(userAppDetailsStore.currentRoleInfo.roleID || 'POLY_ROLE_ID');
  }, [userAppDetailsStore.currentRoleInfo]);

  useEffect(()=>{
    getPolyapi(appID || '', tableID || '', {
      active: 1,
    }).then((res: any) => {
      setPolyapiList(res?.list || []);
    });
    getSubordinateList();
  }, []);

  useEffect(() => {
    (JSON.stringify(store.authority) !== '{}') && polyapiList.length && getPolyBtnObj();
  }, [store.authority, polyapiList]);

  useEffect(()=>{
    if ( JSON.stringify(polyBtnObj) !== '{}') {
      for (const key in polyBtnObj) {
        getApiPermit(appID || '', polyBtnObj[key]).then((res: any) => {
          const { condition } = res;
          btnConObj[key] = condition;
          setBtnCondition({ ...btnConObj });
        });
      }
    }
  }, [store.authority, polyBtnObj]);

  const getPolyBtnObj = ()=>{
    const { authority } = store;
    const arr = ['get', 'update', 'delete'];
    const obj: any = {};

    for (const key in authority) {
      const _key = key.replace(`/api/v1/form/${appID}/home/form/${tableID}/`, '').split('-')[0];
      if (arr.indexOf(_key) > -1) {
        obj[_key] = null;
      }
    }
    for (const key in obj) {
      const item = polyapiList?.find((item: any)=>item.name === `${tableID}_${key}.r`);
      if (item) {
        obj[key] = {
          roleID: store.curRoleID,
          path: item?.accessPath || '',
          uri: item?.uri || '',
          method: item?.method || '',
        };
      }
    }
    setPolyBtnObj(obj);
  };

  const getOperateButtonAuth = (type: string, data: { creator_id: any; }, btnCondition: any): boolean | undefined=>{
    try {
      if (btnCondition[type]) {
        const condition = btnCondition[type];
        const { creator_id } = data;
        switch (condition?.type) {
        case 'ALL': return true;
        case 'SELF': return (creator_id === window.USER.id) ? true : false;
        case 'SELF_WITH_SUB':
          if (creator_id === window.USER.id || isSubordinate(creator_id)) {
            return true;
          } else {
            return false;
          }
        case 'CUSTOM':
          if (JSON.stringify(condition) === '{}') {
            return true;
          }
          if (JSON.stringify(condition).indexOf('$user') > -1 && JSON.stringify(condition).indexOf('$subordinate') > -1) {
            if (creator_id === window.USER.id || isSubordinate(creator_id)) {
              return true;
            }
          }
          if (JSON.stringify(condition).indexOf('$user') > -1) {
            if (creator_id === window.USER.id) {
              return true;
            }
          }
          if (JSON.stringify(condition).indexOf('$subordinate') > -1) {
            if (isSubordinate(creator_id)) {
              return true;
            }
          }

          return false;
        default: return true;
        }
      }
    } catch (error) {
      // console.log(error)
      return true;
    }
  };

  const getSubordinateList = ()=>{
    const queryGraphQL = 'query(page:0,size:10)';
    const userGraphQL = '{users{id,email,name,departments{id,name},roles{id,name},leaders{id,name}},total}';
    getSubordinate({
      query: `{${queryGraphQL}${userGraphQL}}`,
    }).then((res: any)=>{
      setSubordinateList(res?.users || []);
    });
  };

  const isSubordinate = (creator_id: any)=>{
    const item = subordinateList.find((item: { id: any; })=>item.id === creator_id);
    return item ? true : false;
  };

  const tableHeaderBtnList = useMemo(() => {
    return Object.entries(BUTTON_GROUP).reduce((acc: TableHeaderBtn[], [key, buttonValue]) => {
      const _apiPath = getAPIPath(appID, tableID, key, 'POST');
      if (store.authority[_apiPath]) {
        return [...acc, buttonValue];
      }
      return acc;
    }, []);
  }, [store.authority]);

  function goEdit(rowID: string): void {
    setCurRowID(rowID);
    setModalType('dataForm');
  }

  function goView(rowID: string, btnAuth: any): void {
    setCurRowID(rowID);
    setModalType('details');
    setModalBtnAuth(btnAuth);
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
    }).catch((err) => {
      toast.error(err);
    });
  }

  const getCustomColumns = ()=> [{
    id: 'action',
    Header: '操作',
    fixed: true,
    accessor: (rowData: any) => {
      const perParams = { appID, tableID, authority: store.authority };
      const showUpdate = getOperateButtonAuth('update', rowData, btnCondition);
      const showDel = getOperateButtonAuth('delete', rowData, btnCondition);
      const showDetail = getOperateButtonAuth('get', rowData, btnCondition);
      return (
        <div key={new Date().getTime()}>
          {
          // (getOperateButtonPer('get', perParams) || userAppDetailsStore.perPoly) &&
            showDetail &&
          (
            <span
              onClick={() => {
                store.operationType = '查看';
                goView(rowData._id, { update: showUpdate, delete: showDel });
              }}
              className='mr-16 text-blue-600 cursor-pointer'
            >
              查看
            </span>
          )}
          {
          // (getOperateButtonPer('update', perParams) || userAppDetailsStore.perPoly) &&
            showUpdate &&
          (
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
          {
          // (getOperateButtonPer('delete', rowData) || userAppDetailsStore.perPoly) &&
            showDel &&
          (
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
    if (fetchSchemeLoading) {
      return <PageLoading />;
    }

    return (
      <FormAppDataTable
        showCheckbox={getOperateButtonPer('batchRemove', { appID, tableID, authority: store.authority })}
        ref={formTableRef}
        tableHeaderBtnList={tableHeaderBtnList}
        customColumns={getCustomColumns()}
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
      <TableContext.Provider value={{ appID, tableID, name }}>
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
                setOperationType={store.setOperationType}
                btnAuth={modalBtnAuth}
              />
            )}
          </div>
        </div>
      </TableContext.Provider>
    </QueryClientProvider>
  );
}

export default observer(TableViewDetail);


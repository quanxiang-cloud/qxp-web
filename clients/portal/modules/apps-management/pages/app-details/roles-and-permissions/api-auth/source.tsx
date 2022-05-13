import React, { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import { UnionColumn } from 'react-table';

import Loading from '@c/loading';
import Checkbox from '@c/checkbox';
import Tree from '@c/headless-tree';
import Table from '@c/table';
import EmptyTips from '@c/empty-tips';
import Pagination from '@c/pagination';
import { useGetNamespaceFullPath } from '@portal/modules/poly-api/effects/api/namespace';

import store from './store';
import AuthDetailModal from './auth-details';
import NsTreeStore from './ns-tree-store';
import NodeRender from './group-node';
import { Role } from '../constants';

const initialPage = { page: 1, pageSize: 10 };
function Source(): JSX.Element {
  const [curNsPath, setCurNsPath] = useState('');
  const [pagination, setPagination] = useState(initialPage);

  function onClickSetting(api: APIDetailAuth): void {
    store.setCurAPI(api);
    store.showRoleDetailsModal = true;
  }

  const apicol: UnionColumn<APIDetailAuth>[] = [
    {
      Header: 'API名称',
      id: 'title',
      width: 120,
      accessor: ({ title, name }) => title || name,

    },
    {
      Header: '描述',
      id: 'desc',
      accessor: ({ desc }) => desc || '-',
    },
    {
      Header: '是否可访问',
      id: 'auth',
      width: '40',
      accessor: (api) => {
        const disabled = api?.isChanging || store.curRoleType === Role.DEFAULT;
        const checked = !!api.auth || store.curRoleType === Role.DEFAULT;
        return (
          <Checkbox
            disabled={disabled || false}
            checked={checked || false}
            onChange={handleChange}
            value={`${api.accessPath}-${api.uri}-${api.method}`}
          />
        );
      },
    },
    {
      Header: '操作',
      id: 'id',
      width: '80',
      accessor: (api) => {
        const disabled = !api?.auth || store.curRoleType === Role.DEFAULT;
        return (
          <div className={disabled ? 'cursor-not-allowed' : ''}>
            <span
              className={disabled ? 'pointer-events-none text-blue-400' : 'text-btn'}
              onClick={() => onClickSetting(api)}
            >
              设置访问权限
            </span>
          </div>
        );
      },
    },
  ];

  const {
    data: namespaceTree,
    isLoading: isFetchNsTreeLoading,
  } = useGetNamespaceFullPath({
    path: store.rootPath,
    body: { active: 1 },
  }, { enabled: !!store.rootPath });

  const nsStore = useMemo(() => {
    return namespaceTree?.root?.children ? new NsTreeStore(namespaceTree.root) : undefined;
  }, [namespaceTree?.root]);

  useEffect(() => {
    if (!nsStore) {
      store.setCurNamespace(null);
      setCurNsPath('');
      return;
    }
    const firstNode = nsStore.nodeList?.[1] || undefined;
    firstNode && nsStore?.onSelectNode(firstNode?.data?.id);
    store.setCurNamespace(firstNode?.data);
  }, [nsStore]);

  useEffect(() => {
    if (curNsPath) {
      store.fetchAPIFormList(curNsPath, pagination);
      return;
    }
    store.setAPIList([]);
    store.setAPIAndAuthList([]);
  }, [curNsPath, pagination, store.currentRoleID]);

  function onSelect(group: PolyAPI.Namespace): void {
    store.setCurNamespace(group);
    const nspath = `${group.parent}/${group.name}`;
    setCurNsPath(nspath.slice(1) || '');
    setPagination(initialPage);
  }

  if (isFetchNsTreeLoading) {
    return (<Loading className="h-full" desc="加载中..." />);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const _path = e.target.value.split('-');
    const _auth = {
      path: _path[0],
      method: _path[2],
      params: {},
      response: {},
      condition: {},
      uri: _path[1],
      roleID: store.currentRoleID,
      paramsAll: true,
      responseAll: true,
    };
    e.target.checked && store.createAPIAuth(_auth);
    !e.target.checked && store.deleteAPIAuth(_path[0], _path[1], _path[2]);
  }

  function handlePageChange(page: number, pageSize: number): void {
    setPagination({ page, pageSize });
  }

  return (
    <>
      <div className='bg-white data-source h-full'>
        <div className='flex flex-col data-source--sider max-h-full overflow-auto'>
          <div className='py-10 px-16 flex justify-between items-center'>
            <span className='text-h6-bold text-gray-400 mr-auto'>API 分组</span>
          </div>
          {!nsStore && (
            <div className='app-no-data mt-58'>
              <img src='/dist/images/new_tips.svg' />
              <span>无API分组。</span>
            </div>
          )}
          {nsStore && (
            <Tree
              store={nsStore}
              NodeRender={NodeRender}
              RootNodeRender={NodeRender}
              onSelect={onSelect}
              className='overflow-auto'
              itemClassName='tree-node-item hover:bg-white hover:text-gray-900 text-gray-900'
            />
          )}
        </div>
        <div className='bg-white h-full flex-1 overflow-hidden flex flex-col'>
          <div className='conf-title text-12'>
            <div className='text-gray-400 font-semibold'>
              配置权限：<span className='text-gray-900'>{store.curNamespace?.title || ''}</span>
            </div>
          </div>
          <div className='max-flex-1 overflow-hidden'>
            <Table
              rowKey="id"
              loading={store.isLoadingAuth}
              data={store.apiAndAuthList || []}
              emptyTips={<EmptyTips text="无API数据" className="py-10" />}
              columns={apicol}
            />
          </div>
          <Pagination
            current={pagination.page}
            pageSize={pagination.pageSize}
            total={store.apiCount}
            onChange={handlePageChange}
          />
        </div>
      </div>
      {store.showRoleDetailsModal && (
        <AuthDetailModal />
      )}
    </>
  );
}
export default observer(Source);

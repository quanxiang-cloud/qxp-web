import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { UnionColumn } from 'react-table';

import Loading from '@c/loading';
import Checkbox from '@c/checkbox';
import Tree from '@c/headless-tree';
import Table from '@c/table';
import EmptyTips from '@c/empty-tips';
import { flatTree } from '@c/headless-tree/utils';
import { useGetNamespaceFullPath } from '@portal/modules/poly-api/effects/api/namespace';

import store from '../store';
import NsTreeStore from './store';
import NodeRender from './group-node';

function Source(): JSX.Element {
  const [nsStore, setNsStore] = useState<NsTreeStore | null>(null);
  const [curNsPath, setCurNsPath] = useState('');

  const apicol: UnionColumn<APIDetailAuth>[] = [
    {
      Header: 'API名称',
      id: 'title',
      width: 80,
      accessor: 'title',

    },
    {
      Header: '描述',
      id: 'desc',
      accessor: ({ desc }) => desc || '-',
    },
    {
      Header: '是否可访问',
      id: 'id',
      accessor: (api) => {
        return (
          <Checkbox
            checked={!!api.auth || false}
            onChange={handleChange}
            value={api.fullPath}
          />
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

  useEffect(() => {
    if (namespaceTree?.root?.children) {
      const _store = new NsTreeStore(namespaceTree.root);
      const flattenGroups = flatTree(toJS(_store.rootNode));
      const firstNode = flattenGroups.find((v)=> v.visible && v.id);
      firstNode && _store?.onSelectNode(firstNode?.data?.id);
      setNsStore(_store);
      store.setCurNamespace(firstNode?.data);
      return;
    }
    setNsStore(null);
    store.setCurNamespace(null);
  }, [namespaceTree]);

  useEffect(() => {
    if (curNsPath) {
      store.fetchAPIFormList(curNsPath);
      return;
    }
    store.setApiList([]);
    store.setApiAndAuthList([]);
  }, [curNsPath]);

  function onSelect(group: PolyAPI.Namespace): void {
    store.setCurNamespace(group);
    const nspath = `${group.parent}/${group.name}`;
    setCurNsPath(nspath.slice(1) || '');
  }

  if (isFetchNsTreeLoading) {
    return (<Loading className="h-full" desc="加载中..." />);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const _auth = {
      path: e.target.value,
      params: null,
      response: null,
      condition: {},
      roleID: store.currentRoleID,
    };
    e.target.checked && store.createAPIAuth(_auth);
    !e.target.checked && store.deleteAPIAuth(e.target.value);
  }

  return (
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
        <Table
          className='m-16'
          rowKey="id"
          loading={store.isLoadingAuth}
          data={store.apiAndAuthList || []}
          emptyTips={<EmptyTips text="无API数据" className="py-10" />}
          columns={apicol}
        />
      </div>
    </div>
  );
}
export default observer(Source);

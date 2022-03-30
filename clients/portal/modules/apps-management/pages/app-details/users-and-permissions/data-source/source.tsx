import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';

import Loading from '@c/loading';
import Checkbox from '@c/checkbox';
import Tree from '@c/headless-tree';
import { flatTree } from '@c/headless-tree/utils';
import { useGetRequestNodeApiList } from '@portal/modules/poly-api/effects/api/raw';
import { useGetNamespaceFullPath } from '@portal/modules/poly-api/effects/api/namespace';

import store from '../store';
import { APIAuth } from '../api';
import NsTreeStore from './store';
import NodeRender from './group-node';

function Source(): JSX.Element {
  const [nsStore, setNsStore] = useState<NsTreeStore | null>(null);
  const [curNsPath, setCurNsPath] = useState('');
  const [authList, setAuthList] = useState<APIAuth[]>([]);

  const {
    data: namespaceTree,
    isLoading: isFetchNsTreeLoading,
    error: fetchNameSpacePathError,
  } = useGetNamespaceFullPath({
    path: store.rootPath,
    body: { active: 1 },
  }, { enabled: !!store.rootPath });

  useEffect(() => {
    if (namespaceTree && !isLoading && !fetchNameSpacePathError) {
      const _store = new NsTreeStore(namespaceTree.root);
      const flattenGroups = flatTree(toJS(_store.rootNode));
      const firstNode = flattenGroups.find((v)=> v.visible && v.id);
      firstNode && _store?.onSelectNode(firstNode?.data?.id);
      setNsStore(_store);
    }
  }, [namespaceTree]);

  const { data: apiListDetails, isLoading: isFetchListLoading } = useGetRequestNodeApiList({
    path: curNsPath || '',
    body: { active: 1, page: 1, pageSize: -1 },
  }, { enabled: !!curNsPath });

  useEffect(() => {
    store.isLoadingAuth = false;
    store.setApiList(apiListDetails?.list || []);
    const _apiAuthList = apiListDetails?.list.map((api) => {
      return {
        roleID: store.currentRoleID,
        path: api.fullPath,
      };
    });
    !!_apiAuthList?.length && store.fetchAPIListAuth(_apiAuthList)
      .then(setAuthList)
      .finally(() => store.isLoadingAuth = false);
  }, [apiListDetails]);

  const isLoading = isFetchNsTreeLoading && isFetchListLoading;

  function onSelect(group: PolyAPI.Namespace): void {
    const nspath = `${group.parent}/${group.name}`;
    setCurNsPath(nspath.slice(1) || '');
  }

  if (isLoading || !nsStore) {
    return (<Loading className="h-full" desc="加载中..." />);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const [index, path] = e.target.value.split('-');
    const _auth = {
      path,
      params: null,
      response: null,
      roleID: store.currentRoleID,
    };
    authList[Number(index)] = e.target.checked ? _auth : {};
    setAuthList([...authList]);
    e.target.checked && store.createAPIAuth(_auth);
    !e.target.checked && store.deleteAPIAuth(path);
  }

  return (
    <div className='bg-white data-source h-full'>
      <div className='flex flex-col data-source--sider max-h-full overflow-auto'>
        <div className='py-10 px-16 flex justify-between items-center'>
          <span className='text-h6-bold text-gray-400 mr-auto'>API 分组</span>
        </div>
        <Tree
          store={nsStore}
          NodeRender={NodeRender}
          RootNodeRender={NodeRender}
          onSelect={onSelect}
          className='overflow-auto'
          itemClassName='tree-node-item hover:bg-white hover:text-gray-900 text-gray-900'
        />
      </div>
      <div className='bg-white h-full p-16'>
        {store.isLoadingAuth && <Loading className="h-full" desc="加载中..." />}
        {!store.isLoadingAuth && !store.apiList.length && (
          <div>该分组下无API服务</div>
        )}
        <div className='pb-authorized-checkbox-box'>
          {!store.isLoadingAuth && !!store.apiList.length &&
          store.apiList.map(({ fullPath, title }, index) => (
            <Checkbox
              key={fullPath}
              className='border rounded-8 py-8 pl-16'
              checked={!!authList[index]?.path || false}
              onChange={handleChange}
              value={`${index}-${fullPath}`}
              label={title}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
export default observer(Source);

import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Tooltip } from '@QCFE/lego-ui';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { useParams } from 'react-router-dom';

import Tree from '@c/headless-tree';
import { flatTree } from '@c/headless-tree/utils';
import Loading from '@c/loading';
import Search from '@c/search';
import IconBtn from '@c/icon-btn';
import Modal from '@c/modal';

import GroupNode from './group-node';
import FormAddGroup from '../forms/add-group';
import TreeStore from '../stores/api-groups';
import { mockGetApiGroups } from '../mock';
import store from '../stores';

import '../styles.scss';

interface Props {
  className?: string;
}

function SideNav(props: Props): JSX.Element {
  const [search, setSearch] = useState('');
  const [treeStore, setTreeStore] = useState<TreeStore | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { data: groups, isLoading } = useQuery(['api-proxy-groups'], () => {
    return mockGetApiGroups().then((res) => res.data);
  });
  const { groupId } = useParams<{groupId: string}>();

  const handleSelect = (data: APIGroup): void => {
    store.setActiveGroup(data);
    treeStore?.onSelectNode(data?.id);
  };

  const handleSearch = (ev: any) => {

  };

  const handleAddGroup = (data: FormDataCreateApiGroup) => {

  };

  useEffect(() => {
    if (groups && !isLoading) {
      setTreeStore(new TreeStore(groups));
    }
  }, [groups]);

  useEffect(()=> {
    if (groupId && treeStore) {
      const flattenGroups = flatTree(toJS(treeStore.rootNode));
      const checked = flattenGroups.find((v)=> v.id === groupId);
      if (checked) {
        store.setActiveGroup(checked);
        treeStore.onSelectNode(checked.id);
      }
    }
  }, [groupId, treeStore]);

  if (!treeStore) {
    return <Loading />;
  }

  return (
    <div className='flex flex-col min-w-259 overflow-auto bg-white border-r'>
      <div className='py-10 px-10 flex justify-between items-center bg-gray-100 border-b-1 border-gray-200'>
        <span className='text-gray-900 font-medium'>API 分组</span>
        <Tooltip content='新建分组'>
          <IconBtn iconName='add' onClick={() => setModalOpen(true)} />
        </Tooltip>
      </div>

      <div className='mt-10 px-10'>
        <Search
          className="bg-gray-100 mb-20"
          placeholder="输入选项名称"
          value={search}
          onChange={setSearch}
          onKeyDown={handleSearch}
        />
        <Tree
          store={treeStore}
          NodeRender={GroupNode}
          RootNodeRender={()=> null}
          onSelect={handleSelect}
          itemClassName='tree-node-item'
        />
        {modalOpen && (
          <Modal
            title='新增分组'
            width={800}
            onClose={() => setModalOpen(false)}
          >
            <FormAddGroup
              onSubmit={handleAddGroup}
              onCancel={() => setModalOpen(false)}
            />
          </Modal>
        )}
      </div>

    </div>
  );
}

export default observer(SideNav);

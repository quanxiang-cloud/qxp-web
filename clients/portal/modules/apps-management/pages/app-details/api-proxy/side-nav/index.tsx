import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Tooltip } from '@QCFE/lego-ui';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { useForm } from 'react-hook-form';

import Tree from '@c/headless-tree';
import { flatTree } from '@c/headless-tree/utils';
import Loading from '@c/loading';
import Search from '@c/search';
import Icon from '@c/icon';
import Modal from '@c/modal';

import GroupNode from './group-node';
import FormAddGroup from './form-add-group';
import TreeStore from '../stores/api-groups';
import { mockGetApiGroups } from '../mock';
import store from '../stores';
import { useNamespace } from '../hooks';
// import {getServiceList} from '../api'

import '../styles.scss';

interface Props {
  className?: string;
}

function SideNav(props: Props): JSX.Element {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const { data: groups, isLoading } = useQuery(['api-proxy-get-svc-list'], () => {
    return mockGetApiGroups().then((res) => res.data);
    // getServiceList().then((list)=> {
    //   console.log('svc list: ', list)
    // });
  });
  const ns = useNamespace();
  const formInst = useForm();

  const handleSelect = (data: APIGroup): void => {
    store.setActiveGroup(data);
  };

  const handleSearch = (ev: any) => {

  };

  const handleAddGroup = () => {
    // todo
    formInst.handleSubmit(async (data: any)=> {
      console.log('add group: ', data);
    })();
  };

  useEffect(() => {
    if (groups && !isLoading) {
      store.setTreeStore(new TreeStore(groups));
    }
  }, [groups]);

  useEffect(()=> {
    if (store.treeStore) {
      const flattenGroups = flatTree(toJS(store.treeStore.rootNode));
      if (ns) {
        const checked = flattenGroups.find((v)=> v.id === ns);
        checked && handleSelect(checked);
      } else {
        // auto select first none-root node
        const firstNode = flattenGroups.find((v)=> v.visible && v.id);
        firstNode && handleSelect(firstNode);
      }
    }
  }, [ns, store.treeStore]);

  if (!store.treeStore) {
    return <Loading />;
  }

  return (
    <div className='flex flex-col min-w-259 bg-white border-r api-proxy--sider'>
      <div className='py-20 px-16 flex justify-between items-center'>
        <span className='text-h6-bold text-gray-400 mr-auto'>API 目录</span>
        <Tooltip content='新建分组'>
          <Icon
            name='create_new_folder'
            className='cursor-pointer'
            size={20}
            onClick={() => setModalOpen(true)}
            clickable
          />
        </Tooltip>
      </div>
      {!store.treeStore?.noLeafNodes && (
        <div className='px-10'>
          <Search
            className="bg-gray-100 mb-20"
            placeholder="输入选项名称"
            value={search}
            onChange={setSearch}
            onKeyDown={handleSearch}
          />
          <Tree
            store={store.treeStore}
            NodeRender={GroupNode}
            RootNodeRender={()=> null}
            onSelect={handleSelect}
            itemClassName='tree-node-item'
          />
        </div>
      )}
      {modalOpen && (
        <Modal
          title='新增分组'
          onClose={() => setModalOpen(false)}
          footerBtns={[
            { key: 'cancel', text: '取消', onClick: ()=> setModalOpen(false) },
            { key: 'confirm', text: '确认新建', onClick: handleAddGroup, modifier: 'primary' },
          ]}
        >
          <FormAddGroup form={formInst} onSubmit={handleAddGroup} />
        </Modal>
      )}
    </div>
  );
}

export default observer(SideNav);

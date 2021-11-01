import React, { useEffect, useState } from 'react';
import { Tooltip } from '@QCFE/lego-ui';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { useForm } from 'react-hook-form';
import { useUpdateEffect, useDebounce } from 'react-use';
import { useParams } from 'react-router-dom';

import Tree from '@c/headless-tree';
import { flatTree } from '@c/headless-tree/utils';
import Search from '@c/search';
import Icon from '@c/icon';
import Modal from '@c/modal';
import Loading from '@c/loading';
import toast from '@lib/toast';

import GroupNode from './group-node';
import FormAddGroup from './form-add-group';
import store from '../store';
import { useNamespace } from '../hooks';

import '../styles.scss';

function SideNav(): JSX.Element | null {
  const [search, setSearch] = useState('');
  const [nsModalOpen, setNsModalOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const ns = useNamespace();
  const formInst = useForm();
  const { appID } = useParams<{appID: string}>();

  function handleAddGroup(): void {
    formInst.handleSubmit(async (data: any)=> {
      try {
        await store.createNs(store.appRootNs, data);
        setNsModalOpen(false);
      } catch (err) {
        toast.error(err);
      }
    })();
  }

  useEffect(()=> {
    if (store.treeStore) {
      const flattenGroups = flatTree(toJS(store.treeStore.rootNode));
      if (ns) {
        const checked = flattenGroups.find((v)=> v.id === ns);
        checked && store.setActiveNs(checked.data);
      } else {
        // auto select first none-root node
        const firstNode = flattenGroups.find((v)=> v.visible && v.id);
        firstNode && store.setActiveNs(firstNode.data);
      }
    }
  }, [ns, store.treeStore]);

  useDebounce(()=> {
    setDebouncedSearch(search);
  }, 500, [search]);

  // handle search
  useUpdateEffect(()=> {
    if (search) {
      store.searchNamespace(search);
    } else {
      store.fetchNamespaces(appID);
      store.clearFilterNs();
    }
  }, [debouncedSearch]);

  function renderNsList(): JSX.Element {
    if (store.loadingNs) {
      return <Loading />;
    }
    if (Array.isArray(store.filterNsList) && !store.filterNsList.length) {
      return (
        <div className='flex justify-center items-center text-body1'>
          暂无数据
        </div>
      );
    }
    return (
      <Tree
        store={store.treeStore as any}
        NodeRender={GroupNode}
        RootNodeRender={()=> null}
        onSelect={store.setActiveNs}
        itemClassName='tree-node-item'
      />
    );
  }

  return (
    <div className='flex flex-col bg-white border-r api-proxy--sider max-h-full overflow-auto'>
      <div className='py-20 px-16 flex justify-between items-center'>
        <span className='text-h6-bold text-gray-400 mr-auto'>API 分组</span>
        <Tooltip content='新建分组'>
          <Icon
            name='create_new_folder'
            className='cursor-pointer'
            size={20}
            onClick={() => setNsModalOpen(true)}
            clickable
          />
        </Tooltip>
      </div>
      {store.treeStore && (
        <div className='px-10'>
          <Search
            className="bg-gray-100 mb-20"
            placeholder="输入分组名称"
            value={search}
            onChange={setSearch}
            onKeyDown={()=>{}}
          />
          {renderNsList()}
        </div>
      )}
      {nsModalOpen && (
        <Modal
          title='新增分组'
          onClose={() => setNsModalOpen(false)}
          footerBtns={[
            { key: 'cancel', text: '取消', iconName: 'close', onClick: ()=> setNsModalOpen(false) },
            { key: 'confirm', text: '确认新建', iconName: 'check', onClick: handleAddGroup, modifier: 'primary' },
          ]}
        >
          <FormAddGroup form={formInst} onSubmit={handleAddGroup} />
        </Modal>
      )}
    </div>
  );
}

export default observer(SideNav);

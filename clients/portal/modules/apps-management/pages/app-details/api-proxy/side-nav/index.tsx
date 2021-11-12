import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { useForm } from 'react-hook-form';
import { useUpdateEffect, useDebounce } from 'react-use';
import { useParams } from 'react-router-dom';
import { Tooltip } from '@QCFE/lego-ui';

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
        if (!data.title || !data.name) {
          toast.error('分组名称或标识不能为空');
          return;
        }
        data.title = data.title.trim();
        data.name = data.name.trim();
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
        itemClassName='tree-node-item hover:bg-white hover:text-gray-900 text-gray-900'
      />
    );
  }

  return (
    <div className='flex flex-col api-proxy--sider max-h-full overflow-auto api-doc-details-nav'>
      <div className='py-10 px-16 flex justify-between items-center'>
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
      <Search
        className="mb-8 mx-8 side-search"
        placeholder="输入分组名称"
        value={search}
        onChange={setSearch}
        onKeyDown={()=>{}}
      />
      {store.treeStore && renderNsList()}
      {nsModalOpen && (
        <Modal
          title='新建分组'
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

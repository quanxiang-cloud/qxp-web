import React, { useEffect, useState, useCallback } from 'react';
import { inject, observer } from 'mobx-react';
import { Tooltip } from '@QCFE/lego-ui';

import PageLoading from '@appC/page-loading';
import Tree from '@c/headless-tree';
import { TreeNode } from '@c/headless-tree/types';
import Icon from '@c/icon';

import EditGroupModal from './edit-group-modal';
import EditPageModal from './edit-page-modal';
import DelModal from './del-modal';
import PageItem from './page-item';
import './index.scss';

type Props = {
  appPagesStore?: any;
}

function PageNav({ appPagesStore }: Props) {
  const [modalType, setModalType] = useState('');
  const [curEditNode, setCurEditNode] = useState<null | TreeNode<any>>(null);
  const { treeStore, fetchPages, deletePage, addPage, setCurPage } = appPagesStore;

  useEffect(() => {
    fetchPages();
  }, []);

  const onSelect = (node: TreeNode<any>) => {
    console.log('e: ', node);
    setCurPage(node);
  };

  const delPage = () => {
    deletePage(curEditNode);
    closeModal();
  };

  const handleAddPage = (pageInfo) => {
    addPage(pageInfo);
    closeModal();
  };

  const closeModal = () => {
    setModalType('');
    setCurEditNode(null);
  };

  const handleMenuClick = (key: string, node: any) => {
    setCurEditNode(node);
    setModalType(key);
  };

  const onDrop = (e: TreeNode<any>, a: TreeNode<any>) => {
    console.log('e, a: ', e, a);
    return true;
  };

  const PageItemRender = useCallback((props) => {
    return (<PageItem {...props} onMenuClick={handleMenuClick} />);
  }, []);

  if (!treeStore) {
    return <div className='app-details-nav'><PageLoading /></div>;
  }

  return (
    <div className='app-details-nav'>
      <div className='flex justify-between px-16 py-20'>
        <span className='text-h6-bold text-gray-400'>导航</span>
        <Tooltip content='添加分组'>
          <Icon
            onClick={() => setModalType('editGroup')}
            className='app-page-add-group'
            size={20}
            name='create_new_folder'
          />
        </Tooltip>
      </div>
      <Tree
        nodeDraggable={() => true}
        onDragOver={onDrop}
        store={treeStore}
        NodeRender={PageItemRender}
        RootNodeRender={() => <div className='px-16'>页面列表</div>}
        onSelect={onSelect}
      />
      <div onClick={() => setModalType('editPage')} className='add-page-add-btn'>
        <Icon size={24} className='mr-8 app-icon-color-inherit' name='add' />
        <span className='text-body1'>新建页面</span>
      </div>
      <DelModal
        type={modalType === 'delGroup' ? 'group' : 'page'}
        visible={modalType === 'delPage' || modalType === 'delGroup'}
        onOk={delPage}
        onCancel={closeModal}
      />
      {modalType === 'editGroup' && (
        <EditGroupModal
          id={curEditNode?.id}
          name={curEditNode?.name}
          onCancel={closeModal}
        />
      )}
      {modalType === 'editPage' && <EditPageModal pageInfo={curEditNode} onCancel={closeModal} onSubmit={handleAddPage} />}
    </div>
  );
}

export default inject('appPagesStore')(observer(PageNav));

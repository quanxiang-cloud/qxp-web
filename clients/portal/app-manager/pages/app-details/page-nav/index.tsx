import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
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
  const { appId } = useParams<any>();
  const { treeStore, editPage, setCurPage, editGroup, deletePageOrGroup, movePage } = appPagesStore;

  const onSelect = (pageNode: PageInfo) => {
    if (pageNode.menuType === 1) {
      return;
    }

    setCurPage(pageNode);
  };

  const delPageOrGroup = () => {
    deletePageOrGroup(curEditNode, modalType).then(() => {
      closeModal();
    });
  };

  const handleEditPage = (pageInfo: PageInfo) => {
    editPage(pageInfo, curEditNode).then(() => {
      closeModal();
    });
  };

  const handleEditGroup = (groupInfo: GroupInfo) => {
    return editGroup(groupInfo, curEditNode);
  };

  const closeModal = () => {
    setModalType('');
    setCurEditNode(null);
  };

  const handleMenuClick = (key: string, node: any) => {
    setCurEditNode(node);
    setModalType(key);
  };

  const onDrop = (dropTo: TreeNode<any>, draggingNode: TreeNode<any>) => {
    if (dropTo.isLeaf) {
      return Promise.resolve(false);
    }

    return movePage({
      id: draggingNode.id,
      appID: appId,
      fromSort: draggingNode.data.sort,
      toSort: dropTo.data.sort,
      fromGroupID: draggingNode.data.groupID,
      toGroupID: dropTo.id,
    }).then(() => {
      return true;
    });
  };

  const PageItemRender = useCallback((props) => {
    return (<PageItem {...props} onMenuClick={handleMenuClick} />);
  }, []);

  if (!treeStore) {
    return <div className='app-details-nav'><PageLoading /></div>;
  }

  return (
    <div className='app-details-nav'>
      <div className='flex flex-end px-16 py-20'>
        <span className='text-h6-bold text-gray-400 mr-auto'>导航</span>
        <Tooltip content='添加页面'>
          <Icon
            onClick={() => setModalType('editPage')}
            className='app-page-add-group mr-16'
            size={20}
            name='post_add'
          />
        </Tooltip>
        <Tooltip content='添加分组'>
          <Icon
            onClick={() => setModalType('editGroup')}
            className='app-page-add-group'
            size={20}
            name='create_new_folder'
          />
        </Tooltip>
      </div>
      <div className='app-page-tree-wrapper'>
        <Tree
          hideRootNode
          // nodeDraggable={(node): boolean => node.data.menuType === 0}
          // onDrop={onDrop}
          store={treeStore}
          // canDropOn={(node): boolean => !node.isLeaf}
          NodeRender={PageItemRender}
          RootNodeRender={() => <div className='px-16'>页面列表</div>}
          onSelect={onSelect}
        />
      </div>
      {/* <div onClick={() => setModalType('editPage')} className='add-page-add-btn'>
        <Icon size={24} className='mr-8 app-icon-color-inherit' name='add' />
        <span className='text-body1'>新建页面</span>
      </div> */}
      <DelModal
        type={modalType === 'delGroup' ? 'group' : 'page'}
        visible={modalType === 'delPage' || modalType === 'delGroup'}
        onOk={delPageOrGroup}
        onCancel={closeModal}
      />
      {modalType === 'editGroup' && (
        <EditGroupModal
          id={curEditNode?.id}
          name={curEditNode?.name}
          onCancel={closeModal}
          onSubmit={handleEditGroup}
        />
      )}
      {modalType === 'editPage' && (
        <EditPageModal
          appID={appId}
          pageInfo={curEditNode?.data}
          onCancel={closeModal}
          onSubmit={handleEditPage}
        />
      )}
    </div>
  );
}

export default inject('appPagesStore')(observer(PageNav));

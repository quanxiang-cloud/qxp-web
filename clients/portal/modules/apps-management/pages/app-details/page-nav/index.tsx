import React, { useState } from 'react';
import { toJS } from 'mobx';
import { TreeItem } from '@atlaskit/tree';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Tooltip } from '@QCFE/lego-ui';

import PageLoading from '@portal/modules/apps-management/components/page-loading';
import Icon from '@c/icon';
import AppPagesTree from './app-pages-tree';

import EditGroupModal from './edit-group-modal';
import EditPageModal from './edit-page-modal';
import DelModal from './del-modal';
import appPagesStore from '../store';
import './index.scss';

function PageNav() {
  const [modalType, setModalType] = useState('');
  const [curEditNode, setCurEditNode] = useState<null | TreeItem>(null);
  const { appId } = useParams<{appId: string}>();
  const { setCurPage, editGroup, deletePageOrGroup } = appPagesStore;

  function delPageOrGroup() {
    if (!curEditNode) {
      return;
    }

    deletePageOrGroup(curEditNode, modalType).then(() => {
      closeModal();
    });
  }

  function handleEditPage(pageInfo: PageInfo) {
    appPagesStore.editPage(pageInfo).then(() => {
      closeModal();
    });
  }

  const handleEditGroup = (groupInfo: GroupInfo) => {
    return editGroup(groupInfo);
  };

  const closeModal = () => {
    setModalType('');
    setCurEditNode(null);
  };

  const handleMenuClick = (key: string, treeItem: TreeItem) => {
    setCurEditNode(treeItem);
    setModalType(key);
  };

  if (appPagesStore.pageListLoading) {
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
        <AppPagesTree
          tree={toJS(appPagesStore.pagesTreeData)}
          onMenuClick={handleMenuClick}
          selectedPage={appPagesStore.curPage}
          onSelectPage={setCurPage}
          onChange={appPagesStore.updatePagesTree}
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
          id={curEditNode?.id as string}
          name={curEditNode?.data.name}
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

export default observer(PageNav);

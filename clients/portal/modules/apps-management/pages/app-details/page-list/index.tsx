import React, { useState, useEffect } from 'react';
import { toJS } from 'mobx';
import { TreeItem } from '@atlaskit/tree';
import { useParams, useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Tooltip } from '@QCFE/lego-ui';

import PageLoading from '@c/page-loading';
import Icon from '@c/icon';
import { getQuery } from '@lib/utils';

import AppPagesTree from './app-pages-tree';
import EditGroupModal from './edit-group-modal';
import AddGroupPoper from './add-group-poper';
import EditPageModal from './edit-page-modal';
import DelModal from './del-modal';
import appPagesStore from '../store';
import './index.scss';

function PageList() {
  const [modalType, setModalType] = useState('');
  const history = useHistory();
  const [curEditNode, setCurEditNode] = useState<null | TreeItem>(null);
  const { appID } = useParams<{ appID: string }>();
  const { pageID } = getQuery<{ pageID: string }>();
  const { editGroup, deletePageOrGroup, setPageID } = appPagesStore;

  useEffect(() => {
    appPagesStore.fetchPageList(appID);
  }, [appID]);

  useEffect(() => {
    setPageID(pageID);
  }, [pageID]);

  const handleSelectPage = (pageInfo: PageInfo) => {
    history.push(`/apps/details/${appID}/page_setting?pageID=${pageInfo.id}`);
  };

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

  const handleEditGroup = (groupInfo: PageInfo) => {
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
      <div className='flex flex-end px-16 py-20 justify-center'>
        <span className='text-h6-bold text-gray-400 mr-auto'>导航</span>
        <Tooltip content='添加分组'>
          <AddGroupPoper
            id={curEditNode?.id as string}
            onSubmit={handleEditGroup}
          />
        </Tooltip>
      </div>
      <div className='app-page-tree-wrapper'>
        <AppPagesTree
          tree={toJS(appPagesStore.pagesTreeData)}
          onMenuClick={handleMenuClick}
          selectedPage={appPagesStore.curPage}
          onSelectPage={handleSelectPage}
          onChange={appPagesStore.updatePagesTree}
        />
        <div
          className="cursor-pointer h-40 flex items-center px-18 group hover:bg-gray-100"
          onClick={() => setModalType('editPage')}
        >
          <Icon className='app-page-add-group mr-16' size={20} name='add'/>
          新建页面
        </div>
      </div>
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
          appID={appID}
          pageInfo={curEditNode?.data}
          onCancel={closeModal}
          onSubmit={handleEditPage}
        />
      )}
    </div>
  );
}

export default observer(PageList);

import React, { useState, useEffect } from 'react';
import { toJS } from 'mobx';
import { TreeItem } from '@atlaskit/tree';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Tooltip } from '@QCFE/lego-ui';

import PageLoading from '@c/page-loading';
import Icon from '@c/icon';
import { getQuery } from '@lib/utils';

import DelModal from './del-modal';
import appPagesStore from '../store';
import PageDetails from './page-details';
import AppPagesTree from './app-pages-tree';
import AddGroupPoper from './add-group-poper';
import EditPageModal from './edit-page-modal';
import EditGroupModal from './edit-group-modal';
import HidePageConfirmModal from './hide-modal';

import './index.scss';

function PageList(): JSX.Element {
  const history = useHistory();
  const { pathname } = useLocation();
  const [curEditNode, setCurEditNode] = useState<null | TreeItem>(null);
  const { appID } = useParams<{ appID: string }>();
  const { pageID } = getQuery<{ pageID: string }>();
  const {
    curPage,
    editPage,
    setPageID,
    modalType,
    editGroup,
    setModalType,
    pagesTreeData,
    fetchPageList,
    deletePageOrGroup,
    updatePageHideStatus,
    pageListLoading,
    updatePagesTree,
  } = appPagesStore;

  useEffect(() => {
    fetchPageList(appID);
  }, [appID]);

  useEffect(() => {
    setPageID(pageID);
  }, [pageID]);

  const handleSelectPage = (treeItem: TreeItem): void => {
    if (treeItem?.data) {
      history.push(`/apps/details/${appID}/page_setting?pageID=${treeItem.data.id}`);
      setCurEditNode(treeItem);
    }
  };

  async function delPageOrGroup(): Promise<void> {
    if (!curEditNode) {
      return;
    }

    await deletePageOrGroup({ treeItem: curEditNode, type: modalType, history, pathname });
    closeModal();
  }

  function handleEditPage(pageInfo: PageInfo): void {
    editPage(pageInfo).then(() => {
      closeModal();
    });
  }

  function handleVisibleHiddenPage(pageInfo: PageInfo): void {
    updatePageHideStatus(appID, pageInfo).then(() => {
      closeModal();
    });
  }

  const handleEditGroup = (groupInfo: PageInfo): Promise<void> => {
    return editGroup(groupInfo);
  };

  const closeModal = (): void => {
    setModalType('');
    setCurEditNode(null);
  };

  const handleMenuClick = (key: string, treeItem: TreeItem): void => {
    setCurEditNode(treeItem);
    setModalType(key);
  };

  if (pageListLoading) {
    return <div className='app-details-nav'><PageLoading /></div>;
  }

  return (
    <div className="flex h-full">
      <div className='app-details-nav rounded-tl-12'>
        <div className='flex flex-end px-16 py-20 justify-center'>
          <span className='text-h6-bold text-gray-400 mr-auto'>菜单</span>
          <Tooltip content='添加分组'>
            <AddGroupPoper
              onSubmit={handleEditGroup}
            />
          </Tooltip>
        </div>
        <div className='app-page-tree-wrapper'>
          <div
            className="cursor-pointer h-40 flex items-center px-18 group hover:bg-gray-100"
            onClick={() => setModalType('createPage')}
          >
            <Icon className='app-page-add-group mr-4' size={20} name='add'/>
            新建菜单
          </div>
          <AppPagesTree
            tree={toJS(pagesTreeData)}
            onMenuClick={handleMenuClick}
            selectedPage={curPage}
            onSelectPage={handleSelectPage}
            onChange={updatePagesTree}
          />
        </div>
      </div>
      <PageDetails pageID={pageID} />
      {['delPage', 'delGroup'].includes(modalType) && (
        <DelModal
          type={modalType === 'delGroup' ? 'group' : 'page'}
          onOk={delPageOrGroup}
          onCancel={closeModal}
        />
      )}
      {modalType === 'editGroup' && (
        <EditGroupModal
          groupInfo={curEditNode?.data as PageInfo}
          onCancel={closeModal}
          onSubmit={handleEditGroup}
        />
      )}
      {['editPage', 'createPage', 'copyPage'].includes(modalType) && (
        <EditPageModal
          appID={appID}
          pageInfo={modalType === 'createPage' ? undefined : curPage}
          onCancel={closeModal}
          onSubmit={handleEditPage}
        />
      )}
      {modalType === 'hide' && (
        <HidePageConfirmModal
          pageInfo={curPage}
          onCancel={closeModal}
          onOk={() => handleVisibleHiddenPage(curPage)}
        />
      )}
    </div>
  );
}

export default observer(PageList);

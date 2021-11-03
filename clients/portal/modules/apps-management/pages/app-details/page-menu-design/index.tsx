import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { Tooltip } from '@QCFE/lego-ui';

import PageLoading from '@c/page-loading';
import Icon from '@c/icon';
import { getQuery } from '@lib/utils';

import DelModal from './del-modal';
import appPagesStore from '../store';
import PageDetails from './page-details';
import AddGroupPoper from './add-group-poper';
import EditPageModal from './edit-page-modal';
import EditGroupModal from './edit-group-modal';
import HidePageConfirmModal from './hide-modal';
import AppMenuTree from './menu-tree';
import { Menu } from './menu-tree/type';
import { MenuType } from '../type';

import './index.scss';

function PageList(): JSX.Element {
  const history = useHistory();

  const { appID } = useParams<{ appID: string }>();
  const { pageID } = getQuery<{ pageID: string }>();
  const {
    editPage,
    setPageID,
    modalType,
    editGroup,
    setModalType,
    fetchPageList,
    updatePageHideStatus,
    pageListLoading,
    activeMenu,
    pageInitList,
    setActiveMenu,
    del,
  } = appPagesStore;

  useEffect(() => {
    fetchPageList(appID);
  }, [appID]);

  useEffect(() => {
    setPageID(pageID);
  }, [pageID]);

  async function delPageOrGroup(): Promise<void> {
    await del(toJS(activeMenu), modalType);
    closeModal();
  }

  function handleEditPage(pageInfo: PageInfo): void {
    editPage(pageInfo).then(closeModal);
  }

  function handleVisibleHiddenPage(): void {
    updatePageHideStatus(appID, activeMenu).then(closeModal);
  }

  const handleEditGroup = (groupInfo: PageInfo): Promise<void> => {
    if (!groupInfo.icon) {
      groupInfo.icon = 'folder_empty';
    }
    return editGroup(groupInfo);
  };

  const closeModal = (): void => {
    setModalType('');
  };

  useEffect(() => {
    if (!activeMenu.id || activeMenu.menuType === MenuType.group) {
      return;
    }
    history.replace(`/apps/details/${appID}/page_setting?pageID=${activeMenu.id}`);
  }, [activeMenu, appID]);

  const handleMenuClick = (key: string, menu: Menu): void => {
    setActiveMenu(menu);
    setModalType(key);
  };

  if (pageListLoading) {
    return <div className='app-details-nav'><PageLoading /></div>;
  }

  return (
    <div className="flex h-full">
      <div className='app-details-nav rounded-tl-8 bg-gray-50'>
        <div className='h-44 flex flex-end items-center px-16 py-20 justify-center'>
          <span className='font-semibold text-gray-400 mr-auto text-12'>菜单</span>
          <div onClick={() => setModalType('createPage')}>
            <Tooltip content='新建菜单'>
              <Icon className='app-page-add-group mr-8' size={17} name='post_add' />
            </Tooltip>
          </div>
          <Tooltip content='新建分组'>
            <AddGroupPoper
              onSubmit={handleEditGroup}
            />
          </Tooltip>
        </div>
        <div className='app-page-tree-wrapper'>
          <AppMenuTree
            menus={toJS(pageInitList).sort((a, b) => (a?.sort || 0) - (b?.sort || 0))}
            handleMenuClick={handleMenuClick}
          />
        </div>
      </div>
      <PageDetails pageID={pageID} />
      {
        ['delPage', 'delGroup'].includes(modalType) && (
          <DelModal
            type={modalType === 'delGroup' ? 'group' : 'page'}
            onOk={delPageOrGroup}
            onCancel={closeModal}
          />
        )
      }
      {
        modalType === 'editGroup' && (
          <EditGroupModal
            groupInfo={activeMenu as any}
            onCancel={closeModal}
            onSubmit={handleEditGroup}
          />
        )
      }
      {
        ['editPage', 'createPage', 'copyPage'].includes(modalType) && (
          <EditPageModal
            appID={appID}
            pageInfo={modalType === 'createPage' ? undefined : activeMenu as any}
            onCancel={closeModal}
            onSubmit={handleEditPage}
          />
        )
      }
      {
        modalType === 'hide' && (
          <HidePageConfirmModal
            onCancel={closeModal}
            onOk={handleVisibleHiddenPage}
          />
        )
      }
    </div >
  );
}

export default observer(PageList);

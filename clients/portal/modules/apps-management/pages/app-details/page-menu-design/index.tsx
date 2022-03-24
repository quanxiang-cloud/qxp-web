import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';

import PageLoading from '@c/page-loading';
import Icon from '@c/icon';
import Tooltip from '@c/tooltip';
import { getQuery } from '@lib/utils';

import appPagesStore from '../store';
import PageDetails from './page-details';
import EditViewModal from './edit-view-modal';
import AppMenuTree from './menu-tree';
import { Menu } from './menu-tree/type';
import { MenuType } from '../type';
import Orchestrator from '../view-orchestration/orchestrator';

import './index.scss';
import { getBatchGlobalConfig } from '@lib/api/user-config';
import { useQuery } from 'react-query';
import { CreateViewParams, ViewType } from '../view-orchestration/types.d';
function PageList(): JSX.Element {
  const history = useHistory();

  const { appID } = useParams<{ appID: string }>();
  const { pageID } = getQuery<{ pageID: string }>();
  const [appSchemaStore, setAppSchemaStore] = useState<Orchestrator>();
  const [mType, setMType] = useState('');
  // const [isLoading, setLoading] = useState<boolean>(true);

  const { isLoading } = useQuery(['desktop_view_schema'], () => {
    const key = `app_id:${appID}:desktop_view_schema:root`;
    return getBatchGlobalConfig([{ key: key, version: '1.0.0' }])
      .then(({ result }) => JSON.parse(result[key])).then((appLayoutSchema) => {
        setAppSchemaStore(() => {
          const store = new Orchestrator(appID, appLayoutSchema);
          window.store = store;
          console.log(1111, appLayoutSchema);
          return store;
        });
      });
  });

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

  useEffect(() => {
    console.log(appSchemaStore?.views);
  }, [appSchemaStore?.views]);

  async function delPageOrGroup(): Promise<void> {
    await del(toJS(activeMenu), modalType);
    closeModal();
  }

  function handleEditPage(viewInfo: CreateViewParams & { layoutType: string }): void {
    if (viewInfo.layoutType === ViewType.TableSchemaView) {
      appSchemaStore?.addTableSchemaView(viewInfo).then(closeModal);
    }

    if (viewInfo.layoutType === ViewType.SchemaView) {
      appSchemaStore?.addSchemaView(viewInfo).then(closeModal);
    }

    if (viewInfo.layoutType === ViewType.StaticView) {
      appSchemaStore?.addStaticView(viewInfo as any).then(closeModal);
    }
  }

  // function handleVisibleHiddenPage(): void {
  //   updatePageHideStatus(appID, activeMenu).then(closeModal);
  // }

  // const handleEditGroup = (groupInfo: PageInfo): Promise<void> => {
  //   if (!groupInfo.icon) {
  //     groupInfo.icon = 'folder_empty';
  //   }
  //   return editGroup(groupInfo);
  // };

  const closeModal = (): void => {
    setMType('');
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

  if (isLoading && !appSchemaStore) {
    return <div className='app-details-nav'><PageLoading /></div>;
  }

  return (
    <div className="flex h-full">
      <div className='app-details-nav rounded-tl-8 bg-gray-50'>
        <div className='h-44 flex flex-end items-center px-16 py-20 justify-center'>
          <span className='font-semibold text-gray-400 mr-auto text-12'>页面</span>
          <div className="flex items-center">
            <div onClick={() => setMType('createView')}>
              <Tooltip label='新建菜单' position='bottom' wrapperClassName="whitespace-nowrap">
                <Icon className='app-page-add-group mr-8' size={16} name='post_add' />
              </Tooltip>
            </div>
            {/* <Tooltip label='新建分组' position='bottom' wrapperClassName="whitespace-nowrap">
              <AddGroupPoper
                onSubmit={handleEditGroup}
              />
            </Tooltip> */}
          </div>
        </div>
        <div className='app-page-tree-wrapper'>
          <AppMenuTree
            menus={toJS(pageInitList).sort((a, b) => (a?.sort || 0) - (b?.sort || 0))}
            handleMenuClick={handleMenuClick}
          />
        </div>
      </div>
      <PageDetails pageID={pageID} />
      {/* {['delPage'].includes(modalType) && (
        <DelModal
          type={modalType === 'delView' ? 'group' : 'page'}
          onOk={delPageOrGroup}
          onCancel={closeModal}
        />
      )} */}
      {/* {modalType === 'editGroup' && (
        <EditGroupModal
          groupInfo={activeMenu as any}
          onCancel={closeModal}
          onSubmit={handleEditGroup}
        />
      )} */}
      {['editView', 'createView', 'copyView'].includes(mType) && (
        <EditViewModal
          modalType={modalType}
          layouts={appSchemaStore?.layouts || []}
          views={appSchemaStore?.views || []}
          onCancel={closeModal}
          onSubmit={handleEditPage}
          isCopy={modalType === 'copyPage'}
        />
      )}
      {/* {modalType === 'hide' && (
        <HidePageConfirmModal
          onCancel={closeModal}
          onOk={handleVisibleHiddenPage}
        />
      )} */}
    </div >
  );
}

export default observer(PageList);

import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';
import { useQuery } from 'react-query';

import PageLoading from '@c/page-loading';
import Icon from '@c/icon';
import Tooltip from '@c/tooltip';
import { getBatchGlobalConfig } from '@lib/api/user-config';

import ViewList from './view-list';
import ViewDetails from './view-details';
import EditViewModal from './edit-view-modal';
import Orchestrator from '../view-orchestration/orchestrator';

import { CreateViewParams, View, ViewType } from '../view-orchestration/types.d';

import './index.scss';

function PageList(): JSX.Element {
  const history = useHistory();

  const { appID } = useParams<{ appID: string }>();
  const [appSchemaStore, setAppSchemaStore] = useState<Orchestrator>();
  const [modalType, setModalType] = useState('');
  const [currentView, setCurrentView] = useState<View>();

  const { isLoading } = useQuery(['desktop_view_schema'], () => {
    const key = `app_id:${appID}:desktop_view_schema:root`;
    return getBatchGlobalConfig([{ key: key, version: '1.0.0' }])
      .then(({ result }) => JSON.parse(result[key])).then((appLayoutSchema) => {
        setAppSchemaStore(() => {
          const store = new Orchestrator(appID, appLayoutSchema);
          window.store = store;
          setCurrentView(store.views[0] as View);
          console.log(appLayoutSchema);
          return store;
        });
        return appLayoutSchema;
      });
  });

  // async function delPageOrGroup(): Promise<void> {
  //   await del(toJS(activeMenu), modalType);
  //   closeModal();
  // }

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

  function closeModal(): void {
    setModalType('');
  }

  // useEffect(() => {
  //   if (!activeMenu.id || activeMenu.menuType === MenuType.group) {
  //     return;
  //   }
  //   history.replace(`/apps/details/${appID}/page_setting?pageID=${activeMenu.id}`);
  // }, [activeMenu, appID]);

  // const handleMenuClick = (key: string, menu: Menu): void => {
  //   setActiveMenu(menu);
  //   setModalType(key);
  // };

  if (isLoading) {
    return (
      <div className="flex h-full">
        <div className='app-details-nav'><PageLoading /></div>
      </div >
    );
  }

  return (
    <div className="flex h-full">
      <div className='app-details-nav rounded-tl-8 bg-gray-50'>
        <div className='h-44 flex flex-end items-center px-16 py-20 justify-center'>
          <span className='font-semibold text-gray-400 mr-auto text-12'>页面</span>
          <div className="flex items-center">
            <div onClick={() => setModalType('createView')}>
              <Tooltip label='新建页面' position='bottom' wrapperClassName="whitespace-nowrap">
                <Icon className='cursor-pointer mr-8 hover:text-blue-600' size={16} name='post_add' />
              </Tooltip>
            </div>
          </div>
        </div>
        <div className='app-view-list-wrapper h-full'>
          <ViewList
            className='pb-10'
            currentViewID={(currentView as View)?.id || ''}
            views={appSchemaStore?.views as View[]}
            onViewClick={(view) => {
              setCurrentView(view);
            }}
            onOptionClick={(key, view) => {
              console.log(view, key);
            }}
          />
        </div>
      </div>
      <ViewDetails viewInfo={currentView} />
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
      {['editView', 'createView', 'copyView'].includes(modalType) && (
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

import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import PageLoading from '@c/page-loading';

import AppItem from './app-item';
import DeleteAppModal from './app-edit/del-app-modal';
import AppSetStatusModal from './app-edit/app-set-status-modal';
import EditTemplateModal from '../app-templates/template-edit/edit-template-modal';

type Props = {
  isLoading: boolean;
  appList: AppInfo[];
  openCreatedModal: () => void;
}

function AppList({ isLoading, appList, openCreatedModal }: Props): JSX.Element {
  const [modalType, setModalType] = useState('');
  const [curApp, setCurApp] = useState<AppInfo | null>(null);
  const history = useHistory();

  function openModal(_modalType: string, _curApp: AppInfo): void {
    setModalType(_modalType);
    setCurApp(_curApp);
  }

  function goDetails(id: string): void {
    history.push(`/apps/details/${id}/page_setting`);
  }

  function RenderModal() {
    if (!curApp) {
      return null;
    }

    return (
      <>
        {modalType === 'delete' && (
          <DeleteAppModal appInfo={curApp} onCancel={() => setModalType('')} />
        )}
        {modalType === 'publish' && (
          <AppSetStatusModal
            appID={curApp.id}
            onCancel={() => setModalType('')}
            status={curApp.useStatus > 0 ? 'soldOut' : 'publish'}
          />
        )}
        {modalType === 'saveAsTemplate' && (
          <EditTemplateModal
            modalType={modalType}
            templateInfo={{ ...curApp, name: curApp.appName, appID: curApp.id }}
            onCancel={() => setModalType('')}
          />
        )}
      </>
    );
  }

  if (isLoading) {
    return <div className='relative flex-1'><PageLoading /></div>;
  }

  if (appList.length === 0) {
    return (
      <div className='app-no-data mt-58'>
        <img src='/dist/images/new_tips.svg' />
        <span>无应用数据。点击
          <span onClick={openCreatedModal} className='text-btn'>&nbsp;新建应用</span>
          ，开始构建应用
        </span>
      </div>
    );
  }

  return (
    <div className='app-list-container'>
      {appList.map((appInfo: AppInfo) => (
        <AppItem onClick={goDetails} key={appInfo.id} appInfo={appInfo} openModal={openModal} />
      ))}
      <RenderModal />
    </div>
  );
}

export default AppList;

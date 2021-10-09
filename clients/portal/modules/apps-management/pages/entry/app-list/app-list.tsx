import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import PageLoading from '@c/page-loading';

import DeleteAppModal from './app-edit/del-app-modal';
import AppSetStatusModal from './app-edit/app-set-status-modal';
import AppItem from './app-item';

type Props = {
  isLoading: boolean;
  appList: AppInfo[];
  openCreatedModal: () => void;
}

function AppList({ isLoading, appList, openCreatedModal }: Props) {
  const [modalType, setModalType] = useState('');
  const [curApp, setCurApp] = useState<AppInfo | null>(null);
  const history = useHistory();

  const openModal = (_modalType: string, _curApp: AppInfo) => {
    setModalType(_modalType);
    setCurApp(_curApp);
  };

  const goDetails = (id: string) => {
    history.push(`/apps/details/${id}/page_setting`);
  };

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
    <div className='app-list-container mb-4'>
      {appList.map((appInfo: AppInfo) => (
        <AppItem onClick={goDetails} key={appInfo.id} appInfo={appInfo} openModal={openModal} />
      ))}
      {modalType === 'delete' && curApp !== null && (
        <DeleteAppModal appInfo={curApp} onCancel={() => setModalType('')} />
      )}
      {modalType === 'publish' && curApp !== null && (
        <AppSetStatusModal
          status={curApp.useStatus > 0 ? 'soldOut' : 'publish'}
          appID={curApp.id}
          onCancel={() => setModalType('')}
        />
      )}
    </div>
  );
}

export default AppList;

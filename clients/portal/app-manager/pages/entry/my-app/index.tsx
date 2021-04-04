import React, { useEffect, useState } from 'react';
import { observer, inject } from 'mobx-react';

import TextHeader from '@c/text-header';

import CreatedAppModal from './app-edit/created-app-modal';
import Header from './header';
import AppList from './app-list';

import './index.scss';

type Props = {
  appListStore?: any
}

function MyApp({ appListStore }: Props) {
  const [modalType, setModalType] = useState('');
  const { isListLoading, changeParams, appRenderList, params } = appListStore;

  useEffect(() => {
    appListStore.fetchAppList();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <TextHeader
        title="我的应用"
        desc="一个应用是由若干表单、流程表单、报表、自定义页面组成的业务管理系统。"
        action="👋 快速开始"
        className="my-app-header header-background-image "
      />
      <Header setModalType={setModalType} changeParams={changeParams} params={params} />
      <AppList
        openCreatedModal={() => setModalType('CreatedApp')}
        isLoading={isListLoading}
        appList={appRenderList}
      />
      {modalType === 'CreatedApp' && (<CreatedAppModal onCancel={() => setModalType('')} />)}
    </div>
  );
}

export default inject('appListStore')(observer(MyApp));

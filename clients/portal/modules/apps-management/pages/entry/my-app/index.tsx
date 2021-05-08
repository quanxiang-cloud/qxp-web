import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import TextHeader from '@c/text-header';

import CreatedAppModal from './app-edit/created-app-modal';
import Header from './header';
import AppList from './app-list';
import store from './store';
import './index.scss';

function MyApp() {
  const [modalType, setModalType] = useState('');
  const [countMaps, setCountMaps] = useState({
    all: 0,
    published: 0,
    unPublished: 0,
  });
  const { isListLoading, changeParams, params, appList, allAppList } = store;

  useEffect(() => {
    store.fetchAppList();
  }, []);

  useEffect(() => {
    let published = 0;
    let unPublished = 0;
    allAppList.forEach((app: AppInfo) => {
      if (app.useStatus > 0) {
        published += 1;
      } else {
        unPublished += 1;
      }
    });
    setCountMaps({
      all: allAppList.length,
      published,
      unPublished,
    });
  }, [allAppList]);

  return (
    <div className="flex flex-col h-full">
      <TextHeader
        title="我的应用"
        desc="一个应用是由若干表单、流程表单、报表、自定义页面组成的业务管理系统。"
        action="👋 快速开始"
        className="my-app-headertitle bg-gray-1000 px-20 py-16 header-background-image"
        itemTitleClassName="text-h5"
      />
      <Header
        countMaps={countMaps}
        setModalType={setModalType}
        changeParams={changeParams}
        params={params}
      />
      <AppList
        openCreatedModal={() => setModalType('CreatedApp')}
        isLoading={isListLoading}
        appList={appList}
      />
      {modalType === 'CreatedApp' && (<CreatedAppModal onCancel={() => setModalType('')} />)}
    </div>
  );
}

export default observer(MyApp);

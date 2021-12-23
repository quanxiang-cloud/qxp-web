import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useTitle } from 'react-use';

import TextHeader from '@c/text-header';
import { useTaskComplete } from '@c/task-lists/utils';

import CreatedAppModal from './app-edit/created-app-modal';
import Header from './header';
import AppList from './app-list';
import store from './store';
import './index.scss';

function MyApp(): JSX.Element {
  const [modalType, setModalType] = useState('');
  const { isListLoading, changeParams, params, appList, countMaps } = store;

  useTitle('应用管理 - 我的应用');

  useTaskComplete('refresh-app-list', (socketData) => {
    if (socketData.content.command === 'appImport') {
      store.changeParams({});
    }
  });

  useEffect(() => {
    store.changeParams({});

    return () => {
      store.isListLoading = true;
    };
  }, []);

  return (
    <div className="my-apps">
      <TextHeader
        title="我的应用"
        desc="一个应用是由若干表单、流程表单、报表、自定义页面组成的业务管理系统。"
        // action="👋 快速开始"
        className="app-list-headertitle bg-gray-1000 px-20 py-16 header-background-image"
        itemTitleClassName="text-h5"
      />
      <Header
        params={params}
        countMaps={countMaps}
        setModalType={setModalType}
        changeParams={changeParams}
      />
      <AppList
        appList={appList}
        isLoading={isListLoading}
        openCreatedModal={() => setModalType('createdApp')}
      />
      {['createdApp', 'importApp'].includes(modalType) && (
        <CreatedAppModal modalType={modalType} onCancel={() => setModalType('')} />
      )}
    </div>
  );
}

export default observer(MyApp);

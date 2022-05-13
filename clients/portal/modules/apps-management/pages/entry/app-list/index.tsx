import React, { useEffect, useState } from 'react';
import { useTitle } from 'react-use';
import { observer } from 'mobx-react';

import { toast } from '@one-for-all/ui';
import TextHeader from '@c/text-header';
import { useTaskComplete } from '@c/task-lists/utils';

import store from './store';
import Header from './header';
import AppList from './app-list';
import CreatedAppModal from './app-edit/created-app-modal';
import templateStore from '../app-templates/store';

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
    templateStore.fetchList().catch(() => {
      toast.error('获取模版列表失败');
    });
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
        className="app-list-headertitle bg-gray-1000 px-20 py-16 header-background-image h-44"
        itemTitleClassName="text-h6"
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
      {['createdApp', 'importApp', 'createAppWithTemplate'].includes(modalType) && (
        <CreatedAppModal modalType={modalType} onCancel={() => setModalType('')} />
      )}
    </div>
  );
}

export default observer(MyApp);

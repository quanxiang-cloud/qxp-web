import React, { useRef } from 'react';
import { observer } from 'mobx-react';

import Button from '@c/button';
import PageLoading from '@c/page-loading';
import TextHeader from '@c/text-header';

import CreatedEditApp from '../entry/app-list/app-edit/created-edit-app';
import appDetailsStore from './store';

import dayjs from 'dayjs';

function AppInfo() : JSX.Element {
  const formRef: any = useRef();

  const handleSubmit = (): void => {
    const formDom = formRef.current;
    if (formDom.validateFields()) {
      const data = formDom.getFieldsValue();
      data.appIcon = JSON.stringify(data.appIcon);
      appDetailsStore.updateApp(data);
    }
  };

  if (appDetailsStore.loading) {
    return (<PageLoading />);
  }

  return (
    <div className="flex-1">
      <TextHeader
        title="基础设置"
        className="app-list-header header-background-image "
      />
      <div className='px-20 py-24'>
        <CreatedEditApp appInfo={appDetailsStore.appDetails} ref={formRef} />
        <Button onClick={handleSubmit} modifier='primary' iconName='save'>保存修改</Button>
        <div
          className="mt-6 text-gray-600">
          最近保存时间：{dayjs.unix(appDetailsStore.lastUpdateTime).format('YYYY-MM-DD HH:mm:ss')}
        </div>
      </div>
    </div>
  );
}

export default observer(AppInfo);

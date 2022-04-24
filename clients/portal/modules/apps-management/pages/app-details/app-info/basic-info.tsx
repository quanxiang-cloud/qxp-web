import React, { useRef } from 'react';
import { observer } from 'mobx-react';
import dayjs from 'dayjs';

import Card from '@c/card';
import Button from '@c/button';
import PageLoading from '@c/page-loading';

import CreatedEditApp from '../../entry/app-list/app-edit/created-edit-app';
import appDetailsStore from '../store';
import { useEffect } from 'react';

function BasicInfo(): JSX.Element {
  const formRef: any = useRef();

  function handleSubmit(): void {
    const formDom = formRef.current;
    formDom.submit();
  }

  useEffect(() => {
    formRef.current?.validateFields?.();
  }, [formRef.current]);

  function submitCallback(): void {
    const formDom = formRef.current;
    const data = formDom.getFieldsValue();
    appDetailsStore.updateApp(data);
  }

  if (appDetailsStore.loading) {
    return (<PageLoading />);
  }

  return (
    <div className="border rounded-8">
      <Card
        className="h-full transition-opacity flex flex-col flex-1 mt-0"
        headerClassName="px-20 py-16 h-48 nav-card-header"
        title="基本信息"
        itemTitleClassName="text-h6"
        action={(
          <div className="flex items-center">
            <span className="text-gray-400 text-12 mr-8">
              最近保存时间：
              {dayjs.unix(Math.floor(appDetailsStore.lastUpdateTime / 1000) ).format('YYYY-MM-DD HH:mm:ss')}
            </span>
            <Button onClick={handleSubmit} modifier='primary' iconName='save'>更新修改</Button>
          </div>
        )}
        descClassName="text-caption"
      >
        <div className='flex flex-grow mx-20 mt-20 bg-white rounded-12'>
          <CreatedEditApp
            ref={formRef}
            modalType="editApp"
            appInfo={appDetailsStore.appDetails}
            onSubmitCallback={submitCallback}
          />
        </div>
      </Card>
    </div>
  );
}

export default observer(BasicInfo);

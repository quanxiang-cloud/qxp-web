import React, { useRef } from 'react';
import { inject, observer } from 'mobx-react';

import Button from '@c/button';
import PageLoading from '@appC/page-loading';
import TextHeader from '@c/text-header';

import CreatedEditApp from '../../entry/my-app/app-edit/created-edit-app';

type Props = {
  appDetailsStore?: any;
}

function AppInfo({ appDetailsStore }: Props) {
  const formRef: any = useRef();

  const handleSubmit = () => {
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
    <>
      <TextHeader
        title="基础设置"
        className="my-app-header header-background-image "
      />
      <div className='px-20 py-24'>
        <CreatedEditApp appInfo={appDetailsStore.appDetails} ref={formRef} />
        <Button onClick={handleSubmit} modifier='primary' iconName='save'>保存修改</Button>
      </div>
    </>
  );
}

export default inject('appDetailsStore')(observer(AppInfo));

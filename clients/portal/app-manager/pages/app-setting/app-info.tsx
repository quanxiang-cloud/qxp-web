import React, { useRef } from 'react';
import { inject, observer } from 'mobx-react';

import Button from '@appC/button';
import PageLoading from '@appC/page-loading';

import CreatedEditApp from '../entry/my-app/app-edit/created-edit-app';

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
      <CreatedEditApp appInfo={appDetailsStore.appDetails} ref={formRef} />
      <Button onClick={handleSubmit} isPrimary icon='save'>保存修改</Button>
    </>
  );
}

export default inject('appDetailsStore')(observer(AppInfo));

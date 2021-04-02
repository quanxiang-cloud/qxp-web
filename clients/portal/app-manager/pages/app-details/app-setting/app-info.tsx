import React, { useRef } from 'react';

import Button from '@c/button';

import CreatedEditApp from '../../entry/my-app/app-edit/created-edit-app';

function AppInfo() {
  const formRef:any = useRef();

  const handleSubmit = () => {
    const formDom = formRef.current;
    if (formDom.validateFields()) {
      console.log(formDom.getFieldsValue());
      return formDom.getFieldsValue();
    }
  };
  return (
    <>
      <CreatedEditApp ref={formRef} />
      <Button onClick={handleSubmit} isPrimary icon='project'>保存修改</Button>
    </>
  );
}

export default AppInfo;

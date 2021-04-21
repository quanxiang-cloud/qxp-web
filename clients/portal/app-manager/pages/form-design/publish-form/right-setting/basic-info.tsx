import React, { useRef } from 'react';

import Button from '@c/button';

import BasicInfoForm from './basic-info-form';

export default function BasicInfo() {
  const formRef = useRef<any>();

  const submit = () => {
    formRef.current?.handleSubmit((data1) => {
      console.log(data1);
    })();
  };

  return (
    <div>
      <BasicInfoForm ref={formRef} />
      <Button className='mt-20' modifier='primary' onClick={submit}>保存</Button>
    </div>
  );
}

import React, { useRef, useState } from 'react';

import Button from '@c/button';

import BasicInfoForm from './basic-info-form';
import store from '../store';

type Props = {
  rights: Rights
}

export default function BasicInfo({ rights }: Props) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<any>();

  const submit = () => {
    formRef.current?.handleSubmit((newRights: RightsCreate) => {
      setLoading(true);
      store.updatePerGroup({ id: rights.id, ...newRights }).then(()=>{
        setLoading(false);
      });
    })();
  };

  return (
    <div>
      <BasicInfoForm
        defaultValue={{ name: rights.name, description: rights.description }}
        ref={formRef}
      />
      <Button disabled={loading} className='mt-20' modifier='primary' onClick={submit}>保存</Button>
    </div>
  );
}

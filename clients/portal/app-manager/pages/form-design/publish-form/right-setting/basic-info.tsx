import React from 'react';
import { useForm } from 'react-hook-form';

import Button from '@c/button';
import formFieldWrap from '@appC/form-field-wrap';

const Input = formFieldWrap(<input />);
const Textarea = formFieldWrap(<textarea />);

export default function BasicInfo() {
  const { register, getValues, handleSubmit, formState: { errors } } = useForm();
  console.log('errors: ', errors);

  const submit = (data) => {
    console.log('data: ', data);
    console.log(getValues());
  };

  return (
    <div>
      <form onSubmit={handleSubmit(submit)}>
        <input type="text" placeholder="First name" {...register('First name', { required: true, maxLength: 80 })} />
        <Input
          label='权限组名称名称'
          help='不超过 30 个字符，权限组名称不可重复。'
          register={register('name', { required: true, maxLength: 20 })}
        />
        <Textarea
          label='描述信息'
          help='对权限组的补充说明。以便于区分不同的权限组控制的数据范围。'
          register={register('description', { required: true, maxLength: 20 })}
        />
        <input type="submit" />
      </form>
      <Button modifier='primary' onClick={submit}>保存</Button>
    </div>
  );
}

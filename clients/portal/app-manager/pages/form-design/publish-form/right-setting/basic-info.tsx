import React from 'react';
import { useForm } from 'react-hook-form';

import Button from '@c/button';
import formFieldWrap from '@appC/form-field-wrap';

const Input = formFieldWrap(<input />);
const Textarea = formFieldWrap(<textarea />);

export default function BasicInfo() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const submit = () => {
    handleSubmit((data1)=>{
      console.log(data1);
    })();
  };

  return (
    <div>
      <form className='mb-20'>
        <Input
          label='权限组名称名称'
          help='不超过 30 个字符，权限组名称不可重复。'
          error={errors.name}
          register={register('name', { required: '请输入权限组名称', maxLength: { value: 30, message: '不能超过30个字符' } })}
        />
        <Textarea
          label='描述信息'
          help='对权限组的补充说明。以便于区分不同的权限组控制的数据范围。'
          error={errors.description}
          register={register('description', { required: '请输入描述信息', maxLength: { value: 50, message: '不能超过50个字符' } })}
        />
      </form>
      <Button modifier='primary' onClick={submit}>保存</Button>
    </div>
  );
}

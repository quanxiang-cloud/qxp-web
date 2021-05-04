import React, { useImperativeHandle, forwardRef } from 'react';
import { useForm } from 'react-hook-form';

import formFieldWrap from '@portal/modules/app-management/components/form-field-wrap';

type Props = {
  defaultValue?: RightsCreate
}

const Input = formFieldWrap({ field: <input className='input' /> });
const Textarea = formFieldWrap({ field: <textarea className='input' /> });

function BasicInfoForm(
  { defaultValue = { name: '', description: '' } }: Props,
  ref?: React.Ref<any>
) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  useImperativeHandle(ref, () => ({
    handleSubmit: handleSubmit,
  }));

  return (
    <form>
      <Input
        label='权限组名称名称'
        help='不超过 30 个字符，权限组名称不可重复。'
        error={errors.name}
        defaultValue={defaultValue.name}
        register={register('name', { required: '请输入权限组名称', maxLength: { value: 30, message: '不能超过30个字符' } })}
      />
      <Textarea
        label='描述信息'
        help='对权限组的补充说明。以便于区分不同的权限组控制的数据范围。'
        error={errors.description}
        defaultValue={defaultValue.description}
        register={register('description', { required: '请输入描述信息', maxLength: { value: 50, message: '不能超过50个字符' } })}
      />
    </form>
  );
}

export default forwardRef(BasicInfoForm);

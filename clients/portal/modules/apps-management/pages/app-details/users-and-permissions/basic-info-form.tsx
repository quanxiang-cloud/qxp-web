import React, { useImperativeHandle, forwardRef } from 'react';
import { useForm } from 'react-hook-form';
import cs from 'classnames';

import formFieldWrap from '@c/form-field-wrap';

type Props = {
  className?: string
  defaultValue?: RightsCreate
}

const Input = formFieldWrap({ field: <input className='input'/> });
const Textarea = formFieldWrap({ field: <textarea className='input' /> });

function BasicInfoForm(
  { defaultValue, className }: Props,
  ref?: React.Ref<any>,
): JSX.Element {
  const { register, handleSubmit, formState: { errors } } = useForm();

  useImperativeHandle(ref, () => ({
    handleSubmit: handleSubmit,
  }));

  return (
    <div className={className}>
      <Input
        className={cs({ 'bg-gray-100 cursor-not-allowed': defaultValue?.types === 1 })}
        label='角色名称'
        help='不超过 20 个字符，名称不可重复。建议以角色名称命名，例如：普通员工，以便于识别。'
        error={errors.name}
        defaultValue={defaultValue?.name || ''}
        readOnly={defaultValue?.types === 1 || false}
        register={register('name', { required: '请输入权限组名称', maxLength: { value: 30, message: '不能超过30个字符' } })}
      />
      <Textarea
        className='h-58'
        label='描述'
        help='对权限组的补充说明。以便于区分不同的权限组控制的数据范围。'
        placeholder='选填（不超过 100 字符）'
        error={errors.description}
        defaultValue={defaultValue?.description || ''}
        register={register('description', { maxLength: { value: 50, message: '不能超过50个字符' } })}
      />
    </div>
  );
}

export default forwardRef(BasicInfoForm);
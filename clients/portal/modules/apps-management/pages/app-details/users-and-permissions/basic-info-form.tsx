import React, { useImperativeHandle, forwardRef } from 'react';
import { useForm } from 'react-hook-form';
import cs from 'classnames';

import formFieldWrap from '@c/form-field-wrap';

type Props = {
  type: string
  className?: string
  defaultValue?: RightsCreate
}

const Input = formFieldWrap({ field: <input className='input'/> });
const Textarea = formFieldWrap({ field: <textarea className='input' /> });

function BasicInfoForm(
  { type, defaultValue, className }: Props,
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
        defaultValue={type === 'edit' ? defaultValue?.name : ''}
        readOnly={defaultValue?.types === 1 || false}
        register={register('name', {
          required: '请输入权限组名称',
          maxLength: { value: 20, message: '不能超过20个字符' },
          pattern: { value: /^((?!(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f])|(\ud83d[\ude80-\udeff])).)*$/, message: '不能输入表情符号' },
        })}
      />
      <Textarea
        className='h-58'
        label='描述'
        help='对角色的补充说明，以便于区分不同的角色所控制权限和数据范围。'
        placeholder='选填（不超过 50 字符）'
        error={errors.description}
        defaultValue={type === 'edit' ? defaultValue?.description : ''}
        register={register('description', { maxLength: { value: 50, message: '不能超过50个字符' } })}
      />
    </div>
  );
}

export default forwardRef(BasicInfoForm);

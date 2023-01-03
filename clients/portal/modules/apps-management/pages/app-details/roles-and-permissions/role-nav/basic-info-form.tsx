import React, { useImperativeHandle, forwardRef } from 'react';
import { useForm } from 'react-hook-form';
import cs from 'classnames';
// import RadioGroup from '@c/radio/group';
// import Radio from '@c/radio';

import formFieldWrap from '@c/form-field-wrap';

import { Role } from '../constants';

type Props = {
  type: string
  className?: string
  defaultValue?: RoleCreate
}

const Input = formFieldWrap({ field: <input className='input' /> });
const Textarea = formFieldWrap({ field: <textarea className='input' /> });

function BasicInfoForm(
  { type, defaultValue, className }: Props,
  ref?: React.Ref<any>,
): JSX.Element {
  const notAllowEdit = (defaultValue?.type === Role.DEFAULT) && (type === 'edit' );
  const { register, handleSubmit, formState: { errors } } = useForm();
  useImperativeHandle(ref, () => ({
    handleSubmit: handleSubmit,
  }));

  return (
    <div className={className}>
      <Input
        className={cs({ 'bg-gray-100 cursor-not-allowed': notAllowEdit })}
        label='角色名称'
        help='不超过 20 个字符，名称不可重复。建议以角色名称命名，例如：普通员工，以便于识别。'
        error={errors.name}
        defaultValue={type === 'edit' ? defaultValue?.name : ''}
        readOnly={notAllowEdit || false}
        register={register('name', {
          required: '请输入角色名称',
          maxLength: { value: 20, message: '不能超过20个字符' },
          pattern: { value: /^((?!(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f])|(\ud83d[\ude80-\udeff])).)*$/, message: '不能输入表情符号' },
        })}
      />
      {/* <div className='mb-8'>
        <p >角色类型</p>
        <RadioGroup onChange={(value) => console.log(value)}>
          <Radio
            className="mr-8"
            value='group'
            label='组织角色'
            defaultChecked
          />
          <Radio
            className="mr-8"
            value='project'
            label='项目角色'
            // defaultChecked={store.conditionType === option.value}
          />
        </RadioGroup>
      </div> */}
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

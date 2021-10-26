import React, { useEffect } from 'react';
import cs from 'classnames';
import { UseFormReturn } from 'react-hook-form';

import { FormItem, ErrorMsg } from '../comps/form';

interface Props {
  form: UseFormReturn,
  className?: string;
  onSubmit?: (formData: any)=> void;
}

function FormAddGroup({
  className,
  form,
  onSubmit,
}: Props): JSX.Element {
  const { register, formState: { errors } } = form;

  useEffect(()=> {
    return ()=> {
      form.clearErrors();
    };
  }, []);

  return (
    <form onSubmit={onSubmit} className={cs('px-40 py-24 h-full', className)}>
      <FormItem label='分组名称'>
        <input
          type="text"
          className={cs('input', { error: errors.title })}
          {...register('title', { required: '请填写分组名称', shouldUnregister: true })}
        />
        <ErrorMsg errors={errors} name='title'/>
      </FormItem>
      <FormItem label='分组标识'>
        <input
          type="text"
          className={cs('input', { error: errors.name })}
          {...register('name', { required: '请填写分组标识', shouldUnregister: true })}
        />
        <ErrorMsg errors={errors} name='name'/>
        <p className='text-gray-600 text-12'>该标识用于确定唯一路径，新建后不可修改。例如：Qingcloud123</p>
      </FormItem>
      <FormItem label='描述'>
        <textarea
          className='textarea'
          {...register('desc', { shouldUnregister: true })}
          placeholder='选填 (不超过 100 字符)'
        />
      </FormItem>
    </form>
  );
}

export default FormAddGroup;

import React, { useEffect } from 'react';
import cs from 'classnames';
import { UseFormReturn } from 'react-hook-form';

import { FormItem, ErrorMsg } from '../comps/form';

interface Props {
  form: UseFormReturn,
  className?: string;
  onSubmit?: (formData: any)=> void;
  isEdit?: boolean;
  defaultValues?: Record<string, any>;
}

function FormAddGroup({
  className,
  form,
  onSubmit,
  isEdit,
  defaultValues,
}: Props): JSX.Element {
  const { register, formState: { errors }, setValue } = form;

  useEffect(()=> {
    // set default values
    if (defaultValues) {
      Object.entries(defaultValues).forEach(([k, v])=> {
        setValue(k, v);
      });
    }

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
          maxLength={20}
          placeholder='请输入，例如：公司系统'
          {...register('title', {
            required: '请填写分组名称',
            shouldUnregister: true,
            maxLength: 20,
            pattern: { value: /^\S*$/, message: '请勿输入空格' },
          })}
        />
        <ErrorMsg errors={errors} name='title'/>
        <p className='text-gray-600 text-12'>不超过 20 个字符，分组名称不可重复</p>
      </FormItem>
      <FormItem label='分组标识'>
        <input
          type="text"
          className={cs('input', { error: errors.name })}
          maxLength={32}
          placeholder='请输入，例如：sys_001'
          style={isEdit ? { backgroundColor: 'var(--gray-200)' } : {}}
          disabled={isEdit}
          {...register('name', {
            required: '请填写分组标识',
            shouldUnregister: true,
            pattern: { value: /^[a-zA-Z][\w-]+$/, message: '分组标识格式错误' },
            maxLength: 32,
          })}
        />
        <ErrorMsg errors={errors} name='name'/>
        <p className='text-gray-600 text-12'>不超过 32 字符，必须以英文字母开头，只能包含字母、数字、下划线，中划线，标识不可重复。</p>
      </FormItem>
      <FormItem label='描述'>
        <textarea
          maxLength={100}
          className='textarea'
          {...register('desc', { shouldUnregister: true })}
          placeholder='选填 (不超过 100 字符)'
        />
      </FormItem>
    </form>
  );
}

export default FormAddGroup;

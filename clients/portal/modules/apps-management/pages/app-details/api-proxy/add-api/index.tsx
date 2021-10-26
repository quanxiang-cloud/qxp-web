import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import cs from 'classnames';

import Select from '@c/select';
import Button from '@c/button';

import Header from '../comps/header';
import { ErrorMsg } from '../comps/form';
import ParamSection from './param-section';
import ParamForm from './param-form';

import './styles.scss';

interface Props {
  className?: string;
}

const methodOptions = [
  { label: 'GET', value: 'get' },
  { label: 'POST', value: 'post' },
  { label: 'PUT', value: 'put' },
  { label: 'DELETE', value: 'delete' },
  { label: 'OPTION', value: 'option' },
  { label: 'PATCH', value: 'patch' },
];

function Add(props: Props) {
  const { path } = useRouteMatch();
  const isEdit = path.endsWith(':apiId/edit');
  const formInst = useForm();
  const { register, handleSubmit, formState: { errors } } = formInst;
  const [method, setMethod] = useState('get');
  const history = useHistory();

  function onSubmit(): void {
    handleSubmit(async (d: any)=> {
      console.log('add api: ', d);
    })();
  }

  return (
    <>
      <Header name={isEdit ? 'API 详情' : '新建 API'} />
      <form onSubmit={onSubmit} className='flex flex-col px-20 py-16 w-full'>
        <div className='mb-16'>
          <p>API 名称</p>
          <input
            className={cs('input', { error: errors.title })}
            placeholder='请输入'
            {...register('title', { required: '请填写 API 名称' })}
          />
          <ErrorMsg errors={errors} name='title'/>
          <p className='text-caption'>最多32个字符，支持中文、英文、下划线、数字。例如: 用户登录</p>
        </div>
        <div className='mb-16'>
          <p>描述</p>
          <textarea
            className='textarea' rows={3}
            placeholder='选填 (不超过 100 字符)'
            {...register('description', { maxLength: 100 })}
          />
        </div>

        <div className='flex items-center'>
          <Select options={methodOptions} value={method} onChange={setMethod}/>
          <input
            placeholder='请补全 API 标识 (最多32个字符，支持英文、下划线、数字)。例如: loginUser'
            className={cs('input ml-12', { error: errors.url })}
            {...register('url', { required: true })}
          />
          <ErrorMsg errors={errors} name='url' />
        </div>

        <ParamSection title='请求参数' toggleable>
          <ParamForm title='Query' />
          <ParamForm title='Header' />
          <ParamForm title='Body' />
          <ParamForm title='Path' />
          <ParamForm title='常量参数' />
        </ParamSection>

        <ParamSection title='返回参数' toggleable>
          <ParamForm />
        </ParamSection>

      </form>

      <div className='flex items-center justify-end w-full h-64 bg-gray-100 px-20'>
        <Button onClick={()=> history.goBack()} className='mr-20'>取消</Button>
        <Button modifier='primary' onClick={onSubmit}>
          确认新建
        </Button>
      </div>
    </>
  );
}

export default observer(Add);

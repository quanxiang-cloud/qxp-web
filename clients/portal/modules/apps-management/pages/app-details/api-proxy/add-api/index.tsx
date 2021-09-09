import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import Select from '@c/select';
import Button from '@c/button';

import Header from '../comps/header';
import Content from '../comps/content';
import SideNav from '../side-nav';
import ConfigForm from './config-form';

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
  const { register, handleSubmit, formState } = formInst;
  const [method, setMethod] = useState('get');
  const history = useHistory();

  const onSubmit = ()=> {
    handleSubmit(async (d: any)=> {
      console.log('add api: ', d);
    })();
  };

  return (
    <>
      <SideNav />
      <Content>
        <Header name={isEdit ? 'API 详情' : '新建 API'} />
        <form onSubmit={onSubmit} className='flex flex-col px-20 py-16 w-full h-full'>
          <div className='mb-16'>
            <p>API 名称</p>
            <input className='input' {...register('name')} />
          </div>
          <div className='mb-16'>
            <p>描述</p>
            <textarea className='textarea' {...register('description')} />
          </div>

          <div className='flex'>
            <Select options={methodOptions} value={method} onChange={setMethod}/>
            <input placeholder='http://' className='input ml-12' {...register('url')} />
          </div>

          <div className='config-sec'>
            <div className='sec-title'>请求参数</div>
            <div className='sec-body'>
              <div className='sec'>
                <p>Query</p>
                <ConfigForm />
              </div>
            </div>
          </div>
        </form>

        <div className='flex items-center justify-end w-full h-64 bg-gray-100 px-20'>
          <Button onClick={()=> history.goBack()} className='mr-20'>取消</Button>
          <Button modifier='primary' onClick={onSubmit}>
            确认新建
          </Button>
        </div>
      </Content>
    </>
  );
}

export default observer(Add);

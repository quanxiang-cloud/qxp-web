import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import cs from 'classnames';

import Select from '@c/select';
import Button from '@c/button';

import ParamSection from '../add-api/param-section';
import { ErrorMsg } from '../comps/form';

interface Props {
  className?: string;
}

const protocols = [
  { label: 'HTTPS', value: 'https' },
  { label: 'HTTP', value: 'http' },
];

const authTypes = [
  { label: '无', value: 'none' },
  { label: '签名', value: 'sign' },
];

function GroupSetting(props: Props) {
  const formInst = useForm();
  const { register, handleSubmit, formState: { errors } } = formInst;
  const [protocol, setProtocol] = useState('https');
  const [auth, setAuth] = useState('none');

  const onSubmit = ()=> {
    handleSubmit((d: any)=> {
      console.log('group setting data: ', d);
    })();
  };

  return (
    <>
      <form onSubmit={onSubmit} className='flex flex-col w-full'>
        <ParamSection title='请求协议'>
          <div className='flex items-center'>
            <div className='mr-8'>
              <p className='mb-8'>协议</p>
              <Select options={protocols} value={protocol} onChange={setProtocol}/>
            </div>
            <div className='flex-1 mr-8'>
              <p className='mb-8'>主机地址(域名)</p>
              <input
                type="text"
                className={cs('input', { error: errors.host })}
                defaultValue='www.qingcloud.com'
                {...register('host', { required: '请输入主机地址' })}
              />
            </div>
            <div>
              <p className='mb-8'>端口</p>
              <input
                type="number"
                className={cs('input', { error: errors.port })}
                defaultValue={8080}
                {...register('port', { required: true })}
              />
            </div>
          </div>
        </ParamSection>

        <ParamSection title='鉴权'>
          <div className='mb-16'>
            <p>鉴权方式</p>
            <Select options={authTypes} value={auth} onChange={setAuth} className='w-full'/>
          </div>
          {auth === 'sign' && (
            <div>
              <p>鉴权方法</p>
              <textarea
                className={cs('textarea', { error: errors.auth_content })}
                rows={3}
                {...register('auth_content', { required: '请输入鉴权方法', shouldUnregister: true })}
              />
              <ErrorMsg errors={errors} name='auth_content' />
            </div>
          )}
        </ParamSection>
      </form>

      <div className='flex items-center justify-end w-full h-64 bg-gray-100 px-20 absolute left-0 bottom-0'>
        <Button modifier='primary' onClick={onSubmit}>
          确认提交
        </Button>
      </div>
    </>
  );
}

export default GroupSetting;

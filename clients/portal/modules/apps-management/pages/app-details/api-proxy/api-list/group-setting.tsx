import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import cs from 'classnames';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { omit, isEqual, pick } from 'lodash';

import Select from '@c/select';
import Button from '@c/button';
import Radio from '@c/radio';
import Icon from '@c/icon';
import toast from '@lib/toast';
import Loading from '@c/loading';

import ParamsSection from '../add-api/params-section';
import { ErrorMsg } from '../comps/form';
import store from '../store';

interface Props {
  className?: string;
}

type AuthType='none' | 'signature'

const protocols = [
  { label: 'HTTPS', value: 'https' },
  { label: 'HTTP', value: 'http' },
];

const authTypes = [
  { label: '无', value: 'none' },
  { label: '签名', value: 'signature' },
];

function GroupSetting(props: Props) {
  const svcData = toJS(store.svc);
  const formInst = useForm();
  const { register, handleSubmit, setValue, formState: { errors } } = formInst;
  const [protocol, setProtocol] = useState<string>(svcData ? svcData.schema : 'https');
  const [auth, setAuth] = useState<AuthType>(svcData ? svcData.authType : 'none');

  useEffect(()=> {
    const defaultValues = { hostname: 'www.quanxiang.cloud', port: 433 };
    if (svcData) {
      const [hostname, port] = svcData.host.split(':');
      Object.assign(defaultValues, { hostname, port, authorize: svcData.authContent });
    }
    Object.entries(defaultValues).forEach(([k, v])=> {
      setValue(k, v);
    });
  }, [store.svc]);

  useEffect(()=> {
    setValue('port', protocol === 'https' ? 443 : 80);
  }, [protocol]);

  const onSubmit = ()=> {
    handleSubmit(async ({ hostname, port, authorize }: {hostname: string; port: string; authorize:string})=> {
      const params = {
        schema: protocol,
        authType: auth,
        authorize: authorize || '',
      };
      if (hostname.startsWith('http://') || hostname.startsWith('https://')) {
        toast.error('主机名不包括http协议');
        return;
      }
      if (hostname.includes('/')) {
        toast.error('主机名不包括pathname');
        return;
      }
      if (!/[\w.-]+/.test(hostname)) {
        toast.error('非法的主机名');
        return;
      }
      if (isNaN(parseInt(port))) {
        toast.error('非法的端口号');
      }

      try {
        const data = {
          ...params,
          host: [hostname, port].join(':'),
          name: store.treeStore?.currentFocusedNode.data.name,
        };
        if (!store.svc) {
          await store.createSvc(store.treeStore?.curNodefullNs || '', data);
        } else {
          const finalData = omit(data, 'name');
          const prevData = pick(svcData, ['schema', 'host', 'authType', 'authorize']);
          if (isEqual(finalData, prevData)) {
            toast.success('数据未修改');
            return;
          }
          await store.updateSvc(finalData);
        }
        toast.success('提交成功');
      } catch (err) {
        toast.error(err);
      }
    })();
  };

  if (store.isLoading) {
    return <Loading />;
  }

  return (
    <>
      <form onSubmit={onSubmit} className='flex flex-col w-full'>
        <ParamsSection title='请求协议'>
          <div className='flex items-center'>
            <div className='mr-8 w-100'>
              <p className='mb-8'>协议</p>
              <Select options={protocols} value={protocol} onChange={setProtocol}/>
            </div>
            <div className='flex-1 mr-8'>
              <p className='mb-8'>主机地址(域名)</p>
              <input
                type="text"
                className={cs('input', { error: errors.hostname })}
                {...register('hostname', { required: '请输入主机地址' })}
              />
            </div>
            <div className='w-142'>
              <p className='mb-8'>端口</p>
              <input
                type="number"
                className={cs('input', { error: errors.port })}
                {...register('port', { required: true })}
              />
            </div>
          </div>
        </ParamsSection>

        <ParamsSection title='鉴权'>
          <div className='mb-16'>
            <p className='flex items-center'>
              <span>鉴权方式</span>
              <Icon name='help_outline' className='ml-3 cursor-pointer' />
            </p>
            <div className='flex items-center gap-x-16'>
              {authTypes.map(({ label, value }, idx)=> (
                <Radio
                  key={idx}
                  value={value}
                  label={label}
                  defaultChecked={value === auth}
                  onChange={(val: any)=> setAuth(val)}
                />
              ))}
            </div>
          </div>
          {auth === 'signature' && (
            <>
              <div>
                <p>鉴权方法</p>
                <textarea
                  className={cs('textarea', { error: errors.authorize })}
                  rows={3}
                  placeholder='请输入'
                  {...register('authorize', { required: '请输入鉴权方法' })}
                />
                <ErrorMsg errors={errors} name='authorize' />
              </div>
              <p>
                <a href="#" rel="noopener" className='inline-flex items-center underline text-gray-600'>
                  <Icon name='menu_book' className='mr-5' />
                  如何编写鉴权方法
                </a>
              </p>
            </>

          )}
        </ParamsSection>
      </form>

      <div className='flex items-center justify-end w-full h-64 bg-gray-100 px-20 absolute left-0 bottom-0'>
        <Button modifier='primary' onClick={onSubmit} iconName='check'>
          {store.svc ? '确认修改' : '确认提交'}
        </Button>
      </div>
    </>
  );
}

export default observer(GroupSetting);

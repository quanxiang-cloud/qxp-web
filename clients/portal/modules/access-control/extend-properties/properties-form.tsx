import React from 'react';
import { useForm } from 'react-hook-form';
import cs from 'classnames';
import { observer } from 'mobx-react';

import { ErrorMsg } from '@portal/modules/apps-management/pages/app-details/api-proxy/comps/form';
import Select from '@c/select';
import Button from '@c/button';

import store from './store';
import { FromTypes } from './type';

export const typeOptions: Array<{label: string, value: FromTypes}> = [
  { label: '文字', value: 'words' },
  { label: '数字', value: 'number' },
  { label: '布尔', value: 'boolen' },
  { label: '时间日期', value: 'time' },
];
const timeOptions = [
  {
    label: '年',
    value: 'YYYY',
  },
  {
    label: '年-月',
    value: 'YYYY-MM',
  },
  {
    label: '年-月-日',
    value: 'YYYY-MM-DD',
  },
  {
    label: '年-月-日 时-分',
    value: 'YYYY-MM-DD HH:mm',
  },
  {
    label: '年-月-日 时-分-秒',
    value: 'YYYY-MM-DD HH:mm:ss',
  },
];

function PropertiesForm(): JSX.Element {
  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: 'onChange',
    defaultValues: store.curColDetail,
  });

  return (
    <>
      <form className='flex flex-col px-20 pt-16 overflow-auto'>
        <div className='mb-16'>
          <p>
            <span className='text-red-900 mr-2'>*</span>
            字段名称
          </p>
          <input
            className={cs('from-input', { error: errors.name })}
            placeholder='请输入'
            maxLength={64}
            {...register('name', {
              required: '请填写字段名称',
              pattern: {
                value: /^((?!(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f])|(\ud83d[\ude80-\udeff])).)*$/,
                message: '不能输入emoji表情符号',
              },
            })} />
          <ErrorMsg errors={errors} name='name' />
        </div>
        <div className='mb-16'>
          <p>
            <span className='text-red-900 mr-2'>*</span>
            字段英文名
          </p>
          <input
            className={cs('from-input', { error: errors.columnName })}
            placeholder='请输入'
            disabled={store.isEdit}
            maxLength={64}
            {...register('columnName', {
              required: '请填写字段英文名称',
              pattern: {
                value: /^[a-zA-Z_$][\w-$]*$/,
                message: '只能输入英文、下划线',
              },
            })} />
          <ErrorMsg errors={errors} name='columnName' />
        </div>
        <div className='mb-16'>
          <p className='mb-8'>
            <span className='text-red-900 mr-2'>*</span>
            字段类型
          </p>
          <Select
            style={{ maxWidth: '100%' }}
            value={store.params.types}
            disabled={store.isEdit}
            options={typeOptions}
            onChange={(val) => store.params = { ...store.params, types: val }} />
        </div>
        {store.params.types === 'words' && (
          <div className='mb-16'>
            <p>字段长度</p>
            <input
              type='number'
              className={cs('from-input', { error: errors.len })}
              placeholder='请输入'
              disabled={store.isEdit}
              maxLength={2}
              {...register('len', {
                required: '请填写字段长度',
                pattern: { value: /^[0-9]+$/, message: '请输入正整数' },
              })} />
            <ErrorMsg errors={errors} name='len' />
          </div>
        )}
        {store.params.types === 'number' && (
          <div className='mb-16'>
            <p>小数点位数</p>
            <input
              type='number'
              className={cs('from-input', { error: errors.pointLen })}
              placeholder='请输入'
              disabled={store.isEdit}
              maxLength={2}
              {...register('pointLen', {
                pattern: { value: /^[0-9]+$/, message: '请输入正整数' },
              })} />
            <ErrorMsg errors={errors} name='pointLen' />
          </div>
        )}
        {store.params.types === 'time' && (
          <div className='mb-16'>
            <p className='mb-8'>时间格式</p>
            <Select
              style={{ maxWidth: '100%' }}
              value={store.params.format}
              options={timeOptions}
              onChange={(val) => store.params = { ...store.params, format: val }}
            />
          </div>
        )}
      </form>
      <div className='flex items-center justify-end w-full h-64 bg-gray-100 px-20 rounded-b-12'>
        <Button onClick={() => store.setIsVisible(false)} iconName='close' className='mr-20'>取消</Button>
        <Button
          modifier='primary'
          iconName='check'
          onClick={handleSubmit(store.onSubmit)}
        >
          提交
        </Button>
      </div>
    </>
  );
}

export default observer(PropertiesForm);

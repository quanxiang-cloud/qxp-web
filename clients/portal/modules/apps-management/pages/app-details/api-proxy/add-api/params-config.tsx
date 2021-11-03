import React, { useContext } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { observer } from 'mobx-react';
import cs from 'classnames';
import { get } from 'lodash';

import Select from '@c/select';
import Checkbox from '@c/checkbox';
import Icon from '@c/icon';

import paramsContext from './context';

export type ParamType='string' | 'number' | 'boolean' | 'array' | 'object'
export type ParamGroup='path' | 'query' | 'header' | 'body' | 'constant' | 'response'

interface ConfigProps {
  group: ParamGroup;
  title?: string;
  className?: string;
  children?: React.ReactNode;
  defaultValues?: ApiParam[];
}

export interface ApiParam {
  id: string;
  name: string;
  type: ParamType,
  required: boolean;
  description: string;
  readonlyKeys?: string[];
  [key: string]: any;
}

const paramTypes = [
  { label: 'String', value: 'string' },
  { label: 'Number', value: 'number' },
  { label: 'Boolean', value: 'boolean' },
  { label: 'Array', value: 'array' },
  { label: 'Object', value: 'object' },
];

function ParamsConfig({ title, group, defaultValues }: ConfigProps) {
  const store = useContext(paramsContext);
  const { register, control, formState: { errors } } = useFormContext();

  function getFieldName(idx: number, name: string): string {
    return [group, idx, name].join('.');
  }

  function handleChangeField(fieldName: string, val: any): void {
    // console.log('change field: ', fieldName, val);
    store.setFieldValue(fieldName, val);
  }

  return (
    <div className='mb-8'>
      {title && <p className='text-body'>{title}</p>}
      <div>
        <table className='table-auto table border-separate border border-gray-200 w-full rounded-8 params-table'>
          <colgroup>
            <col style={{ width: '40%', overflowX: 'auto' }} />
            <col width={150} />
            <col width={80} />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th>参数名</th>
              <th>参数类型</th>
              <th>是否必填</th>
              <th>描述</th>
            </tr>
          </thead>
          <tbody>
            {store.parameters[group].map(({
              id,
              name,
              required,
              type,
              description,
              readonlyKeys = [],
            }, idx)=> {
              return (
                <tr key={id}>
                  <td className='param-name'>
                    <input
                      type="hidden"
                      className='hidden'
                      defaultValue={id}
                      {...register(getFieldName(idx, 'id'))}
                    />
                    <Controller
                      render={({ field })=> {
                        const readonly = readonlyKeys?.includes('name');
                        return (
                          <input
                            type="text"
                            className={cs('input', {
                              error: get(errors, getFieldName(idx, 'name')),
                              'opacity-50 cursor-not-allowed': readonly,
                            })}
                            maxLength={32}
                            placeholder='新建参数'
                            {...field}
                            value={name}
                            onChange={(ev)=> handleChangeField(getFieldName(idx, 'name'), ev.target.value)}
                            onKeyDown={()=> store.addParam(group, idx)}
                            readOnly={readonly}
                          />
                        );
                      }}
                      name={getFieldName(idx, 'name')}
                      control={control}
                      rules={{
                        validate: (val)=> {
                          // ignore empty string
                          if (!val) {
                            return true;
                          }
                          return /^[a-zA-Z_][\w-]*$/.test(val);
                        },
                      }}
                      shouldUnregister
                    />
                  </td>
                  <td className='param-type'>
                    <Controller
                      render={({ field })=> (
                        <Select
                          options={group === 'path' ? paramTypes.filter(({ value })=> ['string', 'number'].includes(value)) : paramTypes}
                          {...field}
                          value={type}
                          onChange={(val)=> handleChangeField(getFieldName(idx, 'type'), val)}
                        />
                      )}
                      control={control}
                      name={getFieldName(idx, 'type')}
                      shouldUnregister
                    />
                  </td>
                  <td className='param-required'>
                    <Controller
                      render={({ field })=> {
                        const readonly = readonlyKeys?.includes('required');
                        return (
                          <Checkbox
                            className={cs({
                              'cursor-not-allowed': readonly,
                            })}
                            {...field}
                            checked={required}
                            disabled={readonly}
                            onChange={(ev)=> handleChangeField(getFieldName(idx, 'required'), ev.target.checked)}
                          />
                        );
                      }}
                      name={getFieldName(idx, 'required')}
                      control={control}
                      shouldUnregister
                    />
                  </td>
                  <td className='param-desc relative'>
                    <Controller
                      render={({ field })=> (
                        <input
                          type="text"
                          className='input'
                          placeholder='建议输入中文, 最多32字符'
                          maxLength={32}
                          {...field}
                          value={description}
                          onChange={(ev)=> handleChangeField(getFieldName(idx, 'description'), ev.target.value)}
                        />
                      )}
                      name={getFieldName(idx, 'description')}
                      control={control}
                      shouldUnregister
                    />
                    <div className='param-actions absolute right-5 top-5'>
                      {group !== 'path' && <Icon name='delete' onClick={()=> store.removeParam(group, id)} className='cursor-pointer' color='gray' clickable />}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default observer(ParamsConfig);

import React, { useContext, useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import cs from 'classnames';
import { get } from 'lodash';
import { useUpdateEffect } from 'react-use';

import Select from '@c/select';
import Checkbox from '@c/checkbox';
import Icon from '@c/icon';

import { ApiParam, ParamGroup } from './params-config';
import paramsContext from './context';
import { useQueryString } from '../hooks';

interface Props {
  className?: string;
  idx: number;
  group: ParamGroup;
}

const paramTypes = [
  { label: 'string', value: 'string' },
  { label: 'number', value: 'number' },
  { label: 'boolean', value: 'boolean' },
  { label: 'object', value: 'object' },
  { label: 'array', value: 'array' },
];

function ParamRow({
  id,
  name,
  required,
  type,
  description,
  readonlyKeys = [],
  group,
  idx,
  parentPath,
  constIn,
  constData,
  _object_nodes_,
  _array_nodes_,
}: Props & ApiParam) {
  const store = useContext(paramsContext);
  const { register, formState: { errors }, control, watch, getValues } = useFormContext();
  const [expand, setExpand] = useState(false);
  const watchName = watch(getFieldName('name'));
  const qs = useQueryString();
  const isEdit = qs.get('action') === 'edit';

  useUpdateEffect(()=> {
    if (group !== 'constant') {
      return;
    }
    if (!isEdit) {
      // set default constIn value when change method on create mode
      const constIn = ['post', 'put'].includes(store.metaInfo.method) ? 'body' : 'query';
      store.setFieldValue(getFieldName('constIn'), constIn);
    }
  }, [store.metaInfo.method]);

  /*
  level:
  query.0.name  level-1
  query.0.type
  query.0._object_nodes_.0.name    level-2 object
  query.0._object_nodes_.0._object_nodes_.0.name  level-3
  query.0._array_nodes_.1.name   level-2 array
 */
  function getFieldName(name: string): string {
    return [parentPath || group, idx, name].join('.');
  }

  function handleChangeField(fieldName: string, val: any): void {
    // console.log('change field: ', fieldName, val);
    store.setFieldValue(fieldName, val);
  }

  function getValidTypes(): LabelValue[] {
    if (group === 'path') {
      return paramTypes.filter(({ value })=> ['string', 'number'].includes(value));
    }
    if (group === 'constant') {
      return paramTypes.filter(({ value })=> ['string', 'number', 'boolean'].includes(value));
    }
    if (['query', 'header'].includes(group)) {
      return paramTypes.filter(({ value })=> ['string', 'number', 'boolean'].includes(value));
    }
    return paramTypes;
  }

  function getLevel(): number {
    return (parentPath || '').split('.').filter((v)=> Number.isInteger(parseInt(v))).length;
  }

  function renderExpandBtn(): JSX.Element | null {
    if ((type === 'object' && !!_object_nodes_?.length) || (type === 'array' && !!_array_nodes_?.length)) {
      return (
        <Icon
          name={expand ? 'expand_more' : 'expand_less'}
          className='-mr-3 ml-8 cursor-pointer'
          onClick={()=> setExpand((expand)=> !expand)}
          clickable
        />
      );
    }
    return null;
  }

  return (
    <tr key={id}>
      <td className={cs('param-name flex items-center relative')} style={{
        paddingLeft: (getLevel() * 20) + 'px',
      }}>
        <input
          type="hidden"
          className='hidden'
          defaultValue={id}
          {...register(getFieldName('id'))}
        />
        {renderExpandBtn()}
        <Controller
          render={({ field })=> {
            const readonly = readonlyKeys?.includes('name');
            return (
              <input
                type="text"
                className={cs('input', {
                  error: get(errors, getFieldName('name')),
                  'opacity-50 cursor-not-allowed': readonly,
                })}
                maxLength={32}
                placeholder='新建参数'
                {...field}
                value={name}
                onChange={(ev)=> {
                  const { value } = ev.target;
                  if (!value || /^[a-zA-Z_][\w-]*$/.test(value)) {
                    field.onChange(ev.target.value);
                    handleChangeField(getFieldName('name'), ev.target.value);
                  }
                }}
                onKeyDown={()=> store.addParam(group, idx)}
                readOnly={readonly}
              />
            );
          }}
          name={getFieldName('name')}
          control={control}
          rules={{
            validate: (val)=> {
              if (!val) {
                return true;
              }
              return /^[a-zA-Z_][\w-]*$/.test(val);
            },
          }}
          shouldUnregister
        />
        <div className='param-actions absolute right-5 flex items-center'>
          {group !== 'path' && (
            <>
              {['array', 'object'].includes(type) && (
                <Icon
                  name='playlist_add'
                  onClick={()=> store.addSubParam(group, parentPath || '', idx, type === 'array')}
                  className='cursor-pointer mr-8'
                  color='gray'
                  clickable
                />
              )}
              <Icon
                name='delete'
                onClick={()=> store.removeParam(group, parentPath || '', idx)}
                className='cursor-pointer'
                color='gray'
                clickable
              />
            </>
          )}
        </div>
      </td>
      <td className='param-type'>
        <Controller
          render={({ field })=> (
            <Select
              options={getValidTypes()}
              {...field}
              value={type}
              onChange={(val)=> {
                handleChangeField(getFieldName('type'), val);
                // if type changed, should reset sub nodes
                if (type !== val) {
                  store.resetSubNodesByType(getFieldName('type'));
                }
              }}
            />
          )}
          control={control}
          name={getFieldName('type')}
          shouldUnregister
        />
      </td>
      {group === 'constant' && (
        <>
          <td className='param-data'>
            <Controller
              render={({ field })=> {
                return (
                  <input
                    type={type === 'number' ? 'number' : 'text'}
                    className={cs('input', {
                      error: get(errors, getFieldName('constData')),
                    })}
                    maxLength={128}
                    placeholder='请输入'
                    {...field}
                    value={constData}
                    onChange={(ev)=> {
                      field.onChange(ev.target.value);
                      handleChangeField(getFieldName('constData'), ev.target.value);
                    }}
                  />
                );
              }}
              name={getFieldName('constData')}
              control={control}
              // rules={{
              //   validate: (val)=> {
              //     if (!watchName) {
              //       return true;
              //     }
              //     return !!val;
              //   },
              // }}
              shouldUnregister
            />
          </td>
          <td className='param-in'>
            <Controller
              render={({ field })=> (
                <Select
                  options={[
                    { label: 'query', value: 'query' },
                    { label: 'header', value: 'header' },
                    { label: 'body', value: 'body' },
                  ]}
                  {...field}
                  value={constIn}
                  onChange={(val)=> handleChangeField(getFieldName('constIn'), val)}
                />
              )}
              control={control}
              name={getFieldName('constIn')}
              shouldUnregister
            />
          </td>
        </>
      )}
      {group !== 'constant' && (
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
                  onChange={(ev)=> handleChangeField(getFieldName('required'), ev.target.checked)}
                />
              );
            }}
            name={getFieldName('required')}
            control={control}
            shouldUnregister
          />
        </td>
      )}
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
              onChange={(ev)=> handleChangeField(getFieldName('description'), ev.target.value)}
            />
          )}
          name={getFieldName('description')}
          control={control}
          shouldUnregister
        />
      </td>
    </tr>
  );
}

export default ParamRow;

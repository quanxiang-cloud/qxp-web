/* eslint-disable guard-for-in */
import React, { useEffect } from 'react';
import IconBtn from '@c/icon-btn';
import { Input, Select } from 'antd';
import cs from 'classnames';

interface Props {
  targetSchema?: ISchema;
  onRemove: () => void;
  onChange: (data: any) => void;
  formType?: any;
  tableId?: any;
}

function RuleItem(props: any): JSX.Element {
  const { onChange, onRemove, data, options = [] } = props;
  const hasItem = options?.find((itm: any)=> itm?.value === data?.value?.[0]);

  useEffect(()=>{
    if (data?.value?.[0] && options?.length && !hasItem) {
      onRemove();
    }
  }, [options]);

  const handleQueryValueChange = (e: any)=>{
    // const value = e.target.value.replace(/[\u4e00-\u9fa5]/ig, '');
    const value = e.target.value;
    const filteredString = value?.replace(/[^0-9a-zA-Z_]/g, '');
    onChange({ ...data, queryVal: filteredString });
  };

  const handleFieldChange = (value: any)=>{
    const _value = value?.[value?.length - 1];
    onChange({ ...data, value: value, queryVal: _value });
  };

  const handleSelFieldChange = (value: any)=>{
    onChange({ ...data, value: [value], queryVal: value });
  };

  const getVal = ()=>{
    if (options?.length) {
      if (hasItem) {
        return data?.value;
      } else {
        // onChange({ ...data, value: [], queryVal: '' });
        return [];
      }
    } else {
      return [];
    }
  };

  const getSelVal = ()=>{
    if (options?.length) {
      if (hasItem) {
        return data?.value?.[0];
      } else {
        // onChange({ ...data, value: [], queryVal: '' });
        return [];
      }
    } else {
      return [];
    }
  };

  const getKey = ()=>{
    if (options?.length) {
      if (hasItem) {
        return data?.queryVal;
      } else {
        // onChange({ ...data, queryVal: '' });
        return '';
      }
    } else {
      return '';
    }
  };

  return (
    <div className="flex items-center mb-20">
      {/* <Cascader
        className='w-full ml-8 cascader'
        // value={data?.value || []}
        value={getVal() || []}
        options={options}
        onChange={handleFieldChange} /> */}
      <Select
        className='w-full ml-8 '
        value={getSelVal() || ''}
        options={options}
        onChange={handleSelFieldChange} />
      {
        <div
          className={cs('w-full ml-8 mr-8', {
            'mb--20': false,
          })}
        >
          <Input
            disabled={!data?.value}
            className='ml-8'
            placeholder='请输入查询值'
            // value={data?.queryVal}
            value={getKey()}
            onChange={handleQueryValueChange}
          />
        </div>
      }

      <IconBtn iconName="delete" className="ml-8" onClick={onRemove} />
    </div>
  );
}

export default RuleItem;

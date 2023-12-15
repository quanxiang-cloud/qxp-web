import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

import { valueFromOptions } from './context';
import { InputNumber, Select } from 'antd';
import { isArray, isString } from 'lodash';

interface Props {
  value: any;
  key: any;
  nodesOutputOptions: any;
  onChange?: (data: Partial<any>) => void;
}

function CreateNumber(props: any, ref: React.Ref<RefType>) {
  const { nodesOutputOptions, defaultData = {} } = props;
  const [option, setOption] = useState<any>();
  const [val, setVal] = useState<any>();
  const [key, setKey] = useState<any>();
  useEffect(()=>{
    const { value, key } = defaultData;
    if (!value) {
      setOption('fixedValue');
      return;
    }
    if (isString(value) && value?.includes('.output.')) {
      setOption('nodesOutput');
      setVal(value );
      setKey(key );
    } else {
      setOption('fixedValue');
      setVal(Number(value));
    }
  }, []);

  useEffect(()=>{
    if (isArray(nodesOutputOptions)) {
      const opt = nodesOutputOptions?.find((item: any)=>{
        return item?.value === val;
      });
      if (!opt && option === 'nodesOutput') {
        setVal('');
        setKey('');
      }
    }
  }, [nodesOutputOptions, option]);

  useImperativeHandle(ref, () => {
    return {
      getValues: () => ({
        val,
        key,
      }),
    };
  });
  const renderValueBox = () => {
    if (option === 'fixedValue') {
      return (
        <InputNumber
          type='number'
          precision={0}
          value={val}
          onChange={setVal}
        />
      );
    }
    if (option === 'nodesOutput') {
      return (
        <div className='flex items-cemter'>
          <Select
            style={{ minWidth: '200px' }}
            options={nodesOutputOptions}
            value={val}
            onChange={(val)=>{
              setVal(val);
              const valArr = val?.replace(')', '')?.split('.');
              const key = valArr?.[valArr?.length - 1];
              setKey(key);
            }}
            onClear={()=>{
              setKey('');
            }}
            allowClear
          />
          {/* <div className='flex items-center ml-10'>
            <span>key:</span>
            <Input value={key} onChange={(e)=>{
              const value = e.target.value;
              const filteredString = value?.replace(/[^0-9a-zA-Z_]/g, '');
              setKey(filteredString);
            }}></Input>
          </div> */}
        </div>
      );
    }
  };

  return (
    <div className="flex items-center mt-20 mb-10">
      <span className="">新增倍数：</span>
      {
        (
          <>
            <Select
              className='w-100'
              options={valueFromOptions}
              value={option}
              onChange={(val)=>{
                setOption(val);
                setVal('');
              }}
              allowClear
            />
            <div className="inline-flex items-center custom-field__value ml-8">
              {renderValueBox()}
            </div>
          </>
        )}
    </div>
  );
}

export default forwardRef(CreateNumber);

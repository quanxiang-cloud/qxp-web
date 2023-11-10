import React, { useEffect, useState } from 'react';

import { valueFromOptions } from '../context';
import { InputNumber, Select } from 'antd';
import { isArray, isString } from 'lodash';

interface Props {
  size: any;
  onChange?: (data: Partial<any>) => void;
  nodesOutputOptions: any;
}

function RuleItem(props: any) {
  const { size, onChange, nodesOutputOptions, sizeKey } = props;
  const [option, setOption] = useState<any>();
  const [val, setVal] = useState<any>();
  const [key, setKey] = useState<any>(sizeKey || '');

  useEffect(()=>{
    onChange && onChange({
      size: val,
      sizeKey: key,
      sizeNodeID: nodesOutputOptions?.find((item: any)=>item?.value === val)?.nodeID,
    });
  }), [val, key];

  useEffect(()=>{
    if (!size) {
      setOption('fixedValue');
      return;
    }
    if (isString(size) && size?.includes('.output.')) {
      setOption('nodesOutput');
      setVal(size );
    } else {
      setOption('fixedValue');
      setVal(Number(size));
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

  const handleChange = (value: any): void => {
    setVal(value);
  };

  const renderValueBox = () => {
    if (option === 'fixedValue') {
      return (
        <InputNumber
          type='number'
          precision={0}
          value={val}
          onChange={handleChange}
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
              handleChange(val);
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
    <div className="flex items-center mb-10">
      <span className="text-caption">查询条数:</span>
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
              // allowClear
            />
            <div className="inline-flex items-center custom-field__value ml-8">
              {renderValueBox()}
            </div>
          </>
        )}
    </div>
  );
}

export default RuleItem;

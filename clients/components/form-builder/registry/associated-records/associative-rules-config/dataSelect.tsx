/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Cascader } from 'antd';

const DataSelect = (pro: any)=> {
  const { value, props, mutators } = pro || {};
  const enumArr = JSON.parse(JSON.stringify(props?.enum || []));
  const { componentName, appID, tableID } = enumArr.find((item: any)=>item?.value === value) || {};
  const { rulesOptions = [] } = props?.['x-component-props'] || {};
  const showSelect = componentName !== 'associateddata';
  const [options, setOptions] = useState([]);
  const [defaultValue, setDefaultValue] = useState([]);

  useEffect(()=>{
    setOptions(rulesOptions.sort((a: any, b: any)=>a.index - b.index));
  }, [rulesOptions]);

  useEffect(()=>{
    const _arr = value?.split('.');
    const _defaultValue: any = [];
    const item: any = options?.find((item: any)=>{
      return item.value === _arr?.[0];
    });
    item && _defaultValue.push(item?.label);
    if (_arr?.length === 2) {
      const child = item?.children?.find((child: any)=>{
        return child.value === _arr?.[1];
      });
      child && _defaultValue.push(child?.label);
    }
    setDefaultValue(_defaultValue);
  }, [value, options]);

  const handleChange = (value: any) => {
    mutators?.change(value.join('.'));
  };

  return (
    <>
      <Cascader options = {options} value={defaultValue} allowClear={false} onChange={handleChange} />
    </>
  );
};

DataSelect.isFieldComponent = true;

export default DataSelect;

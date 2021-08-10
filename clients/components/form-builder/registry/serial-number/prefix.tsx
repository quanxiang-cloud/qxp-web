import React from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { Select, Input } from 'antd';

export type Format = 'yyyy' | 'yyyyMM' | 'yyyyMMdd' | 'yyyyMMddHHmm' | 'yyyyMMddHHmmss';

const selectOption = [
  {
    label: '无',
    value: '',
  },
  {
    label: '年',
    value: 'yyyy',
  },
  {
    label: '年月',
    value: 'yyyyMM',
  },
  {
    label: '年月日',
    value: 'yyyyMMdd',
  },
  {
    label: '年月日时分',
    value: 'yyyyMMddHHmm',
  },
  {
    label: '年月日时分秒',
    value: 'yyyyMMddHHmmss',
  },
];

function Prefix(props: ISchemaFieldComponentProps): JSX.Element {
  const { value } = props;
  const onSelectChange = (values: Format): void => {
    const selectValue = {
      frontward: value.frontward,
      backward: values,
    };
    props.mutators.change(selectValue);
  };
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const prefixInput = e.target.value;
    const inputValue = {
      frontward: prefixInput,
      backward: value.backward,
    };
    props.mutators.change(inputValue);
  };

  return (
    <div className='ant-col ant-form-item-control contents'>
      <Input
        placeholder='请输入前缀'
        value={value.frontward}
        onChange={onInputChange}
        style={{ width: '40%' }}
      />
      <Select value={value.backward} onChange={onSelectChange} style={{ width: '60%' }}>
        {selectOption.map((itm)=>{
          return <Select.Option value={itm.value} key={itm.value}>{itm.label}</Select.Option>;
        })}
      </Select>
    </div>
  );
}

Prefix.isFieldComponent = true;

export default Prefix;

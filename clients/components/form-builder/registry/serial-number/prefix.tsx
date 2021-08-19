import React from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { Select, Input } from 'antd';

export type Format = 'YYYY' | 'YYYYMM' | 'YYYYMMDD' | 'YYYYMMDDhhmm' | 'YYYYMMDDhhmmss';

const selectOption: Array<{ label: string, value: Format | '' }> = [
  {
    label: '无',
    value: '',
  },
  {
    label: '年',
    value: 'YYYY',
  },
  {
    label: '年月',
    value: 'YYYYMM',
  },
  {
    label: '年月日',
    value: 'YYYYMMDD',
  },
  {
    label: '年月日时分',
    value: 'YYYYMMDDhhmm',
  },
  {
    label: '年月日时分秒',
    value: 'YYYYMMDDhhmmss',
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

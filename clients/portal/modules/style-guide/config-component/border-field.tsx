import React from 'react';
import { Select } from 'antd';
import { get } from 'lodash';
import { Identifier, Dimension } from 'css-tree';

import SizeController from '../components/size-controller';

type Value = {
  type: 'none' | 'solid' | 'dashed' | 'dotted',
  position: 'all' | 'top' | 'right' | 'bottom' | 'left',
  width: number;
  color: string;
}

const BORDER_TYPES = ['solid', 'dashed', 'dotted'];
const BORDER_POSITION = [
  {
    label: '全部',
    value: 'all',
  },
  {
    label: '上',
    value: 'top',
  },
  {
    label: '右',
    value: 'right',
  },
  {
    label: '下',
    value: 'bottom',
  },
  {
    label: '左',
    value: 'left',
  },
];

export default function BorderField({
  onChange,
  value,
}: StyleFieldBaseProps): JSX.Element {
  const [width, type, color] = get(value, 'value.children', []).map((valueObj: Identifier | Dimension)=>{
    if (valueObj.type === 'Dimension') {
      return valueObj.value;
    }

    return valueObj.name;
  });

  function handleChange(valueList: string[]): void {
    onChange({
      important: false,
      property: 'border',
      type: 'Declaration',
      value: {
        type: 'Value',
        children: valueList.map((_value, index)=>{
          if (index === 0) {
            return {
              type: 'Dimension',
              unit: 'px',
              value: _value,
            };
          }

          return {
            name: _value,
            type: 'Identifier',
          };
        }),
      },
    });
  }

  return (
    <div className='grid gap-5'>
      {/* <Select
        value={position}
        options={BORDER_POSITION}
        onChange={(_position) => handleChange({ position: _position })}
      /> */}
      <Select value={type} onChange={(_type) => handleChange([width, _type, color])}>
        <Select.Option value='none'>None</Select.Option>
        {BORDER_TYPES.map((borderType) => (
          <Select.Option key={borderType} value={borderType}>
            <div style={{ borderTop: `2px ${borderType} black` }} className='w-100 mt-12' />
          </Select.Option>
        ))}
      </Select>
      <SizeController value={width} onChange={(_width) => handleChange([_width, type, color])} />
      <input value={color} type='color' onChange={(e) => handleChange([width, type, e.target.value])} />
    </div>
  );
}

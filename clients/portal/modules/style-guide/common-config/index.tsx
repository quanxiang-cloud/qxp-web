import React from 'react';
import { Select, SelectProps } from 'antd';
import { observer } from 'mobx-react';

import { COLORS } from '../constant';
import store from '../store';

function ColorSelect({ value, onChange }: SelectProps<string>): JSX.Element {
  return (
    <Select style={{ width: '300px' }} value={value} onChange={onChange}>
      {COLORS.map((color) => (
        <Select.Option key={color} value={color}>
          <div style={{ color: `var(--${color}-500)` }}>
            <span
              style={{ backgroundColor: `var(--${color}-500)` }}
              className='inline-block w-10 h-10 mr-5'
            />
            {color}
          </div>
        </Select.Option>
      ))}
    </Select>
  );
}

function CommonConfig(): JSX.Element {
  return (
    <div className='px-10'>
      <div>
        <span>主色：</span>
        <ColorSelect
          value={store.commonConfig.primaryColor}
          onChange={(value) => store.setCommonConfig({ primaryColor: value })}
        />
      </div>
    </div>
  );
}

export default observer(CommonConfig);

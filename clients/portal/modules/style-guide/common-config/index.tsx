import React from 'react';
import { Select, SelectProps } from 'antd';
import { observer } from 'mobx-react';

import colorVars from '../css-variables.json';

import store from '../store';

function ColorSelect({ value, onChange }: SelectProps<string>): JSX.Element {
  return (
    <Select style={{ width: '300px' }} value={value} onChange={onChange}>
      {colorVars.baseColors.colors.map((color) => (
        <Select.Option key={color.name} value={color.name}>
          <div style={{ color: `var(--${color.name}-${colorVars.baseColors.primaryColorNo})` }}>
            <span
              style={{ backgroundColor: `var(--${color.name}-500)` }}
              className='inline-block w-10 h-10 mr-5'
            />
            {color.name}
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

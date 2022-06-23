import React from 'react';
import { observer } from 'mobx-react';
import cs from 'classnames';

import RadioGroup from '@c/radio/group';
import Radio from '@c/radio';

import store from '../store';
import { DATA_RANGE_OPTIONS } from '../../constants';

function DataRange(): JSX.Element {
  const disabled = store.conditionType !== 'CUSTOM';
  return (
    <div className='flex flex-col h-full overflow-hidden'>
      <div className='flex mb-16'>
        请选择：
        <RadioGroup onChange={(value) => store.onChangeConditionType(value as string)}>
          {DATA_RANGE_OPTIONS.map((option) => {
            return (
              <Radio
                className="mr-8"
                key={option.value}
                value={option.value}
                label={option.label}
                defaultChecked={store.conditionType === option.value}
              />
            );
          })}
        </RadioGroup>
      </div>
      <textarea
        onChange={(e) => store.onChangeConditionQuery(e.target.value)}
        value={store.conditionQuery}
        disabled={disabled}
        placeholder="请输入JSON格式"
        className={cs('flex-1 p-8 overflow-auto w-full focus:outline-none', {
          'cursor-not-allowed': disabled,
        })}
      />
    </div>
  );
}

export default observer(DataRange);

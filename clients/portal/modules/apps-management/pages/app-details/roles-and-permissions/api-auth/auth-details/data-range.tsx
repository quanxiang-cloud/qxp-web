import React from 'react';
import { observer } from 'mobx-react';

import RadioGroup from '@c/radio/group';
import Radio from '@c/radio';

import store from '../store';
import { DATA_RANGE_OPTIONS } from '../../constants';

function DataRange(): JSX.Element {
  return (
    <>
      <div className='flex'>
        请选择：
        <RadioGroup onChange={(value) => store.onChangeCondition(value as string)}>
          {DATA_RANGE_OPTIONS.map((option) => {
            return (
              <Radio
                className="mr-8"
                key={option.value}
                value={option.value}
                label={option.label}
                defaultChecked={store.conditionValue === option.value}
              />
            );
          })}
        </RadioGroup>
      </div>
    </>
  );
}

export default observer(DataRange);

import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import RadioGroup from '@c/radio/group';
import Radio from '@c/radio';

import store from '../store';
import { DATA_RANGE, DATA_RANGE_OPTIONS } from '../../constants';

function DataRange(): JSX.Element {
  // enmu
  const [conditionValue, setConditionValue] = useState<string>('ALL');

  // store reaction
  useEffect(() => {
    store.curAuth?.condition && Object.keys(DATA_RANGE).forEach((label) => {
      // 比较：对象 深度 loadsh
      if (DATA_RANGE[label] === JSON.stringify(store.curAuth?.condition, null, 4)) {
        setConditionValue(label);
      }
    });
  }, [store.curAuth?.condition]);

  function onChangeCondition(value: string): void {
    setConditionValue(value as string);
    // store
    const curAuth = { ...store.curAuth, condition: JSON.parse(DATA_RANGE[value]) };
    store.setCurAuth(curAuth);
  }

  return (
    <>
      <div className='flex'>
        请选择：
        <RadioGroup onChange={(value) => onChangeCondition(value as string)}>
          {DATA_RANGE_OPTIONS.map((option) => {
            return (
              <Radio
                className="mr-8"
                key={option.value}
                value={option.value}
                label={option.label}
                defaultChecked = {conditionValue === option.value}
              />
            );
          })}
        </RadioGroup>
      </div>
      <div className='mt-16'>
        {/* com */}
        <pre>
          {DATA_RANGE[conditionValue]}
        </pre>
      </div>
    </>
  );
}

export default observer(DataRange);

import React, { useState, useEffect } from 'react';

import RadioGroup from '@c/radio/group';
import Radio from '@c/radio';
import Select from '@c/select';
import usePrevious from '@lib/hooks/use-previous';

import { WhenTimeout } from '../../../store';

interface Props {
  defaultValue?: WhenTimeout;
  onChange: (value: WhenTimeout) => void;
}

export default function WhenTimeout({ defaultValue, onChange }: Props) {
  const [timeoutData, setTimeoutData] = useState<WhenTimeout>(defaultValue || {
    type: '',
    value: '',
  });
  const previousType = usePrevious(timeoutData.type);
  useEffect(() => {
    onChange(timeoutData);
    if (
      (previousType === 'autoDealWith' && timeoutData.type !== 'autoDealWith') ||
      (previousType === 'jump' && timeoutData.type !== 'jump')
    ) {
      setTimeoutData((dt) => ({ ...dt, value: '' }));
    }
  }, [timeoutData]);

  function handleChange(key: string) {
    return (value: string | number | boolean) => {
      setTimeoutData((dt) => ({ ...dt, [key]: value }));
    };
  }

  return (
    <div className="bg-gray-100 p-16 input-border-radius mb-20">
      <div className="text-body2 mb-8">超时后: </div>
      <RadioGroup onChange={handleChange('type')}>
        <Radio
          className="mb-8 flex"
          label="不处理"
          value="noDealWith"
          defaultChecked={timeoutData.type === 'noDealWith'}
        />
        <Radio
          className="mb-8 flex"
          label="自动处理"
          value="autoDealWith"
          defaultChecked={timeoutData.type === 'autoDealWith'}
        />
        {timeoutData.type === 'autoDealWith' && (
          <Select
            options={[{
              label: '通过',
              value: 'pass',
            }, {
              label: '驳回',
              value: 'reject',
            }]}
            placeholder="选择自动通过或驳回"
            defaultValue={timeoutData.value}
            onChange={handleChange('value')}
            className="h-32 py-4 border border-gray-300 input-border-radius
                px-12 text-12 flex items-center flex-1 mb-8 ml-22 mt-8"
          />
        )}
        <Radio
          className="mb-8 flex"
          label="跳转至其他节点"
          value="jump"
          defaultChecked={timeoutData.type === 'jump'}
        />
        {timeoutData.type === 'jump' && (
          <Select
            options={[{
              label: '节点名称1',
              value: 'node1',
            }, {
              label: '节点名称2',
              value: 'node2',
            }]}
            placeholder="选择工作流中的节点"
            defaultValue={timeoutData.value}
            onChange={handleChange('value')}
            className="h-32 py-4 border border-gray-300 input-border-radius
                px-12 text-12 flex items-center flex-1 mb-8 ml-22 mt-8"
          />
        )}
      </RadioGroup>
    </div>
  );
}

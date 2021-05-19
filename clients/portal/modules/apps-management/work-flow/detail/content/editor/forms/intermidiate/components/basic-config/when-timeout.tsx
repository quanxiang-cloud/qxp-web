import React, { useState, useEffect } from 'react';
import cs from 'classnames';

import RadioGroup from '@c/radio/group';
import Radio from '@c/radio';
import Select from '@c/select';
import usePrevious from '@lib/hooks/use-previous';
import useObservable from '@lib/hooks/use-observable';
import store from '@flow/detail/content/editor/store';
import type { WhenTimeout, StoreValue } from '@flow/detail/content/editor/type';

interface Props {
  defaultValue?: WhenTimeout;
  onChange: (value: WhenTimeout) => void;
}

export default function WhenTimeout({ defaultValue, onChange }: Props) {
  const [timeoutData, setTimeoutData] = useState<WhenTimeout>(defaultValue || {
    type: '',
    value: '',
  });
  const { elements = [], validating } = useObservable<StoreValue>(store);
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
    <div className="bg-gray-100 p-16 corner-2-8-8-8 mb-20">
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
            className="h-32 py-4 border border-gray-300 corner-2-8-8-8
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
          <div className="mb-8 ml-22">
            <Select
              className={cs(
                'h-32 py-4 border corner-2-8-8-8 px-12 text-12 flex',
                'items-center flex-1 mt-8', {
                  'border-red-600': validating && !timeoutData.value,
                  'border-gray-300': !validating || timeoutData.value,
                })}
              options={elements.reduce(
                (cur: {label: string; value: string;}[], next) => {
                  if (next.type !== 'formData' && next.data) {
                    cur.push({
                      label: next.data.nodeData.name,
                      value: next.id,
                    });
                  }
                  return cur;
                }, [])}
              placeholder="选择工作流中的节点"
              defaultValue={timeoutData.value}
              onChange={handleChange('value')}
            />
            {validating && !timeoutData.value && (
              <div className="text-red-600 mt-4">请选择工作流中的节点</div>
            )}
          </div>
        )}
      </RadioGroup>
    </div>
  );
}

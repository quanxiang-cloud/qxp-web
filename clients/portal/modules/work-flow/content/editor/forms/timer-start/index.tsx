import React, { ReactElement, useState } from 'react';
import Tab from '@c/tab';
import SaveButtonGroup from '@flow/content/editor/components/_common/action-save-button-group';
import type { DelayedData } from '@flow/content/editor/type';
import { Input } from 'antd';
interface Props {
  defaultValue: DelayedData;
  onSubmit: (value: any) => void;
  onCancel: () => void;
}

const Delayed = ({ defaultValue, onSubmit, onCancel }: Props): ReactElement=>{
  const [timer, setTimer] = useState<string>(defaultValue?.timer || '');

  function onSave(): void {
    onSubmit({ timer });
  }

  return (
    <>
      <Tab
        className="mt-10"
        items={[{
          id: 'basicConfig',
          name: '基础配置',
          content: (
            <div className="mb-24 flex flex-col">
              <div className="mb-8">触发事件</div>
              <Input
                className="flex-1 grid"
                value={timer}
                onChange={(e) => setTimer(e.target.value)}
                placeholder="corn表达式：0 0/1 * * * ?"
              />
            </div>
          ),
        }]}
      />
      <SaveButtonGroup onSave={onSave} onCancel={onCancel} />
    </>
  );
};
export default Delayed;

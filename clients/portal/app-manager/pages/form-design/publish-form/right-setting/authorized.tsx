import React, { useState, useEffect } from 'react';

import CheckBox from '@c/checkbox';

const ACTIONS = [
  { label: '查看', value: 'view' },
  { label: '新建', value: 'add' },
  { label: '修改', value: 'edit' },
  { label: '删除', value: 'del' },
];

const BATCH = [
  { label: '批量修改', value: 'view' },
  { label: '批量删除', value: 'add' },
  { label: '导入', value: 'edit' },
  { label: '导出', value: 'del' },
];

export default function Authorized() {
  const [actions, setActions] = useState<string[]>([]);
  const [batchActions, setBatchActions] = useState<string[]>([]);
  const [acIndeterminate, setAcIndeterminate] = useState(false);
  const [baIndeterminate, setBaIndeterminate] = useState(false);

  const setCheckbox = (list: string[], setFun: Function, event: any) => {
    if (event.target.checked) {
      setFun([...list, event.target.value]);
    } else {
      setFun(
        list.filter((value) => value !== event.target.value)
      );
    }
  };

  useEffect(() => {
    setAcIndeterminate(actions.length > 0);
  }, [actions]);

  return (
    <>
      <div className='pb-authorized-box'>
        <div className='flex justify-between h-56 px-20 items-center'>
          <span className='text-h5 mr-8 flex items-center'>
            <CheckBox indeterminate={acIndeterminate} className='mr-8' />
            操作按钮
          </span>
          <span className='text-caption-no-color text-gray-600'>已选 {actions.length}，共 4 项</span>
        </div>
        <div className='pb-authorized-checkbox-box'>
          {ACTIONS.map((action) => (
            <CheckBox
              onChange={(e) => setCheckbox(actions, setActions, e)}
              value={action.value}
              label={action.label}
              key={action.value}
            />
          ))}
        </div>
      </div>
      <div className='pb-authorized-box'>
        <div className='flex justify-between h-56 px-20 items-center'>
          <span className='text-h5 mr-8 flex items-center'>
            <CheckBox indeterminate={baIndeterminate} className='mr-8' />
            批量操作按钮
          </span>
          <span className='text-caption-no-color text-gray-600'>
            已选 {batchActions.length}，共 4 项
          </span>
        </div>
        <div className='pb-authorized-checkbox-box'>
          {BATCH.map((action) => (
            <CheckBox
              onChange={(e) => setCheckbox(batchActions, setBatchActions, e)}
              label={action.label}
              key={action.value}
              value={action.value}
            />
          ))}
        </div>
      </div>
    </>
  );
}

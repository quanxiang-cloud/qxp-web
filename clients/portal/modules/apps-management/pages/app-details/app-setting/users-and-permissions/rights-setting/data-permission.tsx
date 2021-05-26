import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { Radio } from 'antd';

import DataFilter from './data-filter';

type Props = {
  fields: Fields[];
  dataPer: Condition[];
  className?: string;
}

type ConditionItemMap = {
  arr: Condition[];
  tag: string;
}

type ConditionMap = {
  find?: ConditionItemMap;
  delete?: ConditionItemMap;
  update?: ConditionItemMap;
}

const OPTIONS = [
  { label: '全部', value: 'all' },
  { label: '自定义条件', value: 'custom' },
];

function DataPermission({ fields, className = '', dataPer }: Props, ref: React.Ref<any>) {
  const [view, setViewPer] = useState({ key: 'all', conditions: [] });
  const [edit, setEditPer] = useState({ key: 'all', conditions: [] });
  const [del, setDelPer] = useState({ key: 'all', conditions: [] });
  const viewRef = useRef<{ getDataPer:() => Promise<ConditionItemMap | string> }>(null);
  const editRef = useRef<{ getDataPer:() => Promise<ConditionItemMap | string> }>(null);
  const delRef = useRef<{ getDataPer:() => Promise<ConditionItemMap | string> }>(null);

  const getDataPer = () => {
    return Promise.all([
      view.key === 'custom' ? viewRef.current?.getDataPer() : '',
      edit.key === 'custom' ? editRef.current?.getDataPer() : '',
      del.key === 'custom' ? delRef.current?.getDataPer() : '',
    ]).then(([dataView, dataEdit, dataDel]) => {
      if (dataView !== 'notPass' && dataEdit !== 'notPass' && dataDel !== 'notPass') {
        const conditions: ConditionMap = {};
        if (view.key === 'custom' && typeof dataView !== 'string') {
          conditions.find = dataView;
        }
        if (edit.key === 'custom' && typeof dataEdit !== 'string') {
          conditions.update = dataEdit;
        }
        if (del.key === 'custom' && typeof dataDel !== 'string') {
          conditions.delete = dataDel;
        }
        return conditions;
      }

      return false;
    });
  };

  useImperativeHandle(ref, () => ({
    getDataPer: getDataPer,
  }));

  return (
    <div className={className}>
      <div className='mb-20'>
        <p>查看</p>
        <Radio.Group
          value={view.key}
          onChange={(e) => setViewPer({ ...view, key: e.target.value })}
          className='my-16'
          options={OPTIONS}
        />
        {view.key === 'custom' && (
          <DataFilter ref={viewRef} fields={fields} baseConditions={view.conditions} />
        )}
      </div>
      <div className='mb-20'>
        <p>编辑</p>
        <Radio.Group
          value={edit.key}
          onChange={(e) => setEditPer({ ...edit, key: e.target.value })}
          className='my-16'
          options={OPTIONS}
        />
        {edit.key === 'custom' && (
          <DataFilter ref={editRef} fields={fields} baseConditions={edit.conditions} />
        )}
      </div>
      <div>
        <p>删除</p>
        <Radio.Group
          value={del.key}
          onChange={(e) => setDelPer({ ...del, key: e.target.value })}
          className='my-16'
          options={OPTIONS}
        />
        {del.key === 'custom' && <DataFilter ref={delRef} fields={fields} baseConditions={del.conditions} />}
      </div>
    </div>
  );
}

export default forwardRef(DataPermission);

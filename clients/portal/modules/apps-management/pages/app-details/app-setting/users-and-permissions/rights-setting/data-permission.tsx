import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { Radio } from 'antd';

import DataFilter, { ConditionItemMap, RefProps } from '@c/data-filter';

type Props = {
  fields: Fields[];
  dataPer: ConditionMap;
  className?: string;
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
  const [view, setViewPer] = useState({
    key: dataPer.find?.arr ? 'custom' : 'all',
    tag: dataPer.find?.tag,
    conditions: dataPer.find?.arr || [],
  });
  const [edit, setEditPer] = useState({
    key: dataPer.update?.arr ? 'custom' : 'all',
    tag: dataPer.update?.tag,
    conditions: dataPer.update?.arr || [],
  });
  const [del, setDelPer] = useState({
    key: dataPer.delete?.arr ? 'custom' : 'all',
    tag: dataPer.delete?.tag,
    conditions: dataPer.delete?.arr || [],
  });
  const viewRef = useRef<RefProps>(null);
  const editRef = useRef<RefProps>(null);
  const delRef = useRef<RefProps>(null);

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
          <DataFilter initTag={view.tag} ref={viewRef} fields={fields} initConditions={view.conditions} />
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
          <DataFilter initTag={edit.tag} ref={editRef} fields={fields} initConditions={edit.conditions} />
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
        {del.key === 'custom' && (
          <DataFilter initTag={del.tag} ref={delRef} fields={fields} initConditions={del.conditions} />
        )}
      </div>
    </div>
  );
}

export default forwardRef(DataPermission);

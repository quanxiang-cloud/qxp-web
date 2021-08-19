import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { Radio } from 'antd';

import DataFilter, { RefProps } from '@c/data-filter';

type Props = {
  fields: SchemaFieldItem[];
  dataPer: ConditionMap;
  className?: string;
}

type Permission = {
  arr: Condition[];
  tag: 'or' | 'and';
}

type ConditionMap = {
  find?: Permission;
  delete?: Permission;
  update?: Permission;
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

  const getDataValues = async () => {
    const viewFlag = await (view.key === 'custom' ? viewRef.current?.validate() : undefined);
    const editFlag = await (edit.key === 'custom' ? editRef.current?.validate() : undefined);
    const delFlag = await (del.key === 'custom' ? delRef.current?.validate() : undefined);

    if (viewFlag === false || editFlag === false || delFlag === false) {
      return;
    }

    const conditions: ConditionMap = {};

    if (viewFlag) {
      conditions.find = {
        arr: viewRef.current?.getDataValues().condition || [],
        tag: viewRef.current?.getDataValues().tag || 'and',
      };
    }

    if (editFlag) {
      conditions.update = {
        arr: editRef.current?.getDataValues().condition || [],
        tag: editRef.current?.getDataValues().tag || 'and',
      };
    }

    if (delFlag) {
      conditions.delete = {
        arr: delRef.current?.getDataValues().condition || [],
        tag: delRef.current?.getDataValues().tag || 'and',
      };
    }

    return conditions;
  };

  useImperativeHandle(ref, () => ({
    getDataValues: getDataValues,
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

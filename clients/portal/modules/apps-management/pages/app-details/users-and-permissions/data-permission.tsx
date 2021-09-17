import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';

import DataFilter, { RefProps } from '@c/data-filter';
import Icon from '@c/icon';
import Switch from '@c/switch';

import store from './store';

type Props = {
  fields: SchemaFieldItem[];
  dataPer: ConditionMap;
  className?: string;
  abled?: boolean
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

function DataPermission({
  fields, className = '', dataPer, abled,
}: Props, ref: React.Ref<any>): JSX.Element {
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
    reset: () => {
      setViewPer({
        key: dataPer.find?.arr ? 'custom' : 'all',
        tag: dataPer.find?.tag,
        conditions: dataPer.find?.arr || [],
      });
      setEditPer({
        key: dataPer.update?.arr ? 'custom' : 'all',
        tag: dataPer.update?.tag,
        conditions: dataPer.update?.arr || [],
      });
      setDelPer({
        key: dataPer.delete?.arr ? 'custom' : 'all',
        tag: dataPer.delete?.tag,
        conditions: dataPer.delete?.arr || [],
      });
      getDataValues();
    },
  }));

  return (
    <div className={className}>
      <div className='data-permission py-8'>
        <div className='data-permission-item'>
          <div className='permission-name'>
            <div className='permission-name-icon'>
              <Icon name="playlist_add_check" size={24}/>
            </div>
            <div className=''>
              <div className='text-14 text-gray-900 font-semibold'>可查看</div>
              <div className='text-12 text-gray-400'>数据范围</div>
            </div>
          </div>
          <Switch
            className='mr-0'
            value={view.key}
            options={OPTIONS}
            disabled = {store.currentRights.types === 1 || !abled}
            onChange={(value) => setViewPer({ ...view, key: value })}
          />
        </div>
        {view.key === 'custom' && (
          <DataFilter
            className='data-filter'
            initTag={view.tag}
            ref={viewRef}
            fields={fields}
            initConditions={view.conditions}
          />
        )}
      </div>
      <div className='data-permission py-8'>
        <div className='data-permission-item'>
          <div className='permission-name'>
            <div className='permission-name-icon'>
              <Icon name="edit" size={24}/>
            </div>
            <div className=''>
              <div className='text-14 text-gray-900 font-semibold'>可编辑</div>
              <div className='text-12 text-gray-400'>数据范围</div>
            </div>
          </div>
          <Switch
            value={edit.key}
            options={OPTIONS}
            disabled = {store.currentRights.types === 1 || !abled}
            onChange={(value) => setEditPer({ ...edit, key: value })}
          />
        </div>
        {edit.key === 'custom' && (
          <DataFilter
            className='data-filter'
            initTag={edit.tag}
            ref={editRef}
            fields={fields}
            initConditions={view.conditions}
          />
        )}
      </div>
      <div className='data-permission py-8'>
        <div className='data-permission-item'>
          <div className='permission-name'>
            <div className='permission-name-icon'>
              <Icon name="delete_forever" size={24}/>
            </div>
            <div className=''>
              <div className='text-14 text-gray-900 font-semibold'>可删除</div>
              <div className='text-12 text-gray-400'>数据范围</div>
            </div>
          </div>
          <Switch
            value={del.key}
            options={OPTIONS}
            disabled = {store.currentRights.types === 1 || !abled}
            onChange={(value) => setDelPer({ ...del, key: value })}
          />
        </div>
        {del.key === 'custom' && (
          <DataFilter
            className='data-filter'
            initTag={del.tag}
            ref={delRef}
            fields={fields}
            initConditions={del.conditions}
          />
        )}
      </div>
    </div>
  );
}

export default forwardRef(DataPermission);

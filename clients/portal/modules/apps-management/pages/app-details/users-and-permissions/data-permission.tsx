import React, { useState, forwardRef, useImperativeHandle, useRef, useEffect } from 'react';

import DataFilter, { RefProps } from '@c/data-filter';
import { toEs, ESParameter, toFilterConfig } from '@c/data-filter/utils';
import Icon from '@c/icon';
import Switch from '@c/switch';

import store from './store';

type Props = {
  fields: SchemaFieldItem[];
  dataPer: ConditionMap;
  className?: string;
  abled?: boolean
}

type DataPerType = 'custom' | 'all';

type DataPer = FilterConfig & {
  key: DataPerType;
}

type ConditionMap = {
  find?: ESParameter;
  delete?: ESParameter;
  update?: ESParameter;
}

const OPTIONS: { value: DataPerType, label: string }[] = [
  { label: '全部', value: 'all' },
  { label: '自定义条件', value: 'custom' },
];

function DataPermission({
  fields, className = '', dataPer, abled,
}: Props, ref: React.Ref<any>): JSX.Element {
  const [view, setViewPer] = useState<DataPer>({ key: 'all', condition: [], tag: 'must' });
  const [edit, setEditPer] = useState<DataPer>({ key: 'all', condition: [], tag: 'must' });
  const [del, setDelPer] = useState<DataPer>({ key: 'all', condition: [], tag: 'must' });

  useEffect(() => {
    if (dataPer.find) {
      const config = toFilterConfig(dataPer.find);
      setViewPer({ ...config, key: config.condition && config.condition.length ? 'custom' : 'all' });
    }
    if (dataPer.update) {
      const config = toFilterConfig(dataPer.update);
      setEditPer({ ...config, key: config.condition && config.condition.length ? 'custom' : 'all' });
    }
    if (dataPer.delete) {
      const config = toFilterConfig(dataPer.delete);
      setDelPer({ ...config, key: config.condition && config.condition.length ? 'custom' : 'all' });
    }
  }, []);

  const viewRef = useRef<RefProps>(null);
  const editRef = useRef<RefProps>(null);
  const delRef = useRef<RefProps>(null);

  const getDataValues = async () => {
    const viewFlag = await (view?.key === 'custom' ? viewRef.current?.validate() : undefined);
    const editFlag = await (edit?.key === 'custom' ? editRef.current?.validate() : undefined);
    const delFlag = await (del?.key === 'custom' ? delRef.current?.validate() : undefined);

    if (viewFlag === false || editFlag === false || delFlag === false) {
      return;
    }

    const conditions: ConditionMap = {};

    if (viewFlag) {
      conditions.find = toEs(viewRef.current?.getDataValues() || { condition: [], tag: 'must' });
    }

    if (editFlag) {
      conditions.update = toEs(editRef.current?.getDataValues() || { condition: [], tag: 'must' });
    }

    if (delFlag) {
      conditions.delete = toEs(delRef.current?.getDataValues() || { condition: [], tag: 'must' });
    }

    return conditions;
  };

  useImperativeHandle(ref, () => ({
    getDataValues: getDataValues,
  }));

  return (
    <div className={className}>
      <div className='data-permission py-8'>
        <div className='data-permission-item'>
          <div className='permission-name'>
            <div className='permission-name-icon'>
              <Icon name="playlist_add_check" size={24} />
            </div>
            <div className=''>
              <div className='text-14 text-gray-900 font-semibold'>可查看</div>
              <div className='text-12 text-gray-400'>数据范围</div>
            </div>
          </div>
          <Switch
            className='mr-0'
            value={view?.key}
            options={OPTIONS}
            disabled={store.currentRights.types === 1 || !abled}
            onChange={(value) => setViewPer({ ...view, key: value })}
          />
        </div>
        {view?.key === 'custom' && (
          <DataFilter
            className='data-filter'
            initTag={view?.tag}
            ref={viewRef}
            fields={fields}
            initConditions={view?.condition}
          />
        )}
      </div>
      <div className='data-permission py-8'>
        <div className='data-permission-item'>
          <div className='permission-name'>
            <div className='permission-name-icon'>
              <Icon name="edit" size={24} />
            </div>
            <div className=''>
              <div className='text-14 text-gray-900 font-semibold'>可编辑</div>
              <div className='text-12 text-gray-400'>数据范围</div>
            </div>
          </div>
          <Switch
            value={edit?.key}
            options={OPTIONS}
            disabled={store.currentRights.types === 1 || !abled}
            onChange={(value) => setEditPer({ ...edit, key: value })}
          />
        </div>
        {edit?.key === 'custom' && (
          <DataFilter
            className='data-filter'
            initTag={edit.tag}
            ref={editRef}
            fields={fields}
            initConditions={edit?.condition}
          />
        )}
      </div>
      <div className='data-permission py-8'>
        <div className='data-permission-item'>
          <div className='permission-name'>
            <div className='permission-name-icon'>
              <Icon name="delete_forever" size={24} />
            </div>
            <div className=''>
              <div className='text-14 text-gray-900 font-semibold'>可删除</div>
              <div className='text-12 text-gray-400'>数据范围</div>
            </div>
          </div>
          <Switch
            value={del?.key}
            options={OPTIONS}
            disabled={store.currentRights.types === 1 || !abled}
            onChange={(value) => setDelPer({ ...del, key: value })}
          />
        </div>
        {del?.key === 'custom' && (
          <DataFilter
            className='data-filter'
            initTag={del.tag}
            ref={delRef}
            fields={fields}
            initConditions={del?.condition}
          />
        )}
      </div>
    </div>
  );
}

export default forwardRef(DataPermission);

import React, { useState } from 'react';
import { observer } from 'mobx-react';

import Popconfirm from '@c/pop-confirm';
import Icon from '@c/icon';

import store from '../store';

interface Props {
  type: 'tree' | 'list';
  label: string;
  idx?: number;
  nodePath?: string;
}

function EditOptionSetItem({ type, label, idx = 0, nodePath = '' }: Props): JSX.Element {
  const [labelValue, setLabelValue] = useState(label);

  return (
    <Popconfirm
      content={(
        <div className='option-set-popper'>
          <div className='mb-8 text-blueGray-400'>
            修改选项集名称
          </div>
          <input
            value={labelValue}
            className='input input-default mb-4'
            maxLength={100}
            onChange={(ev) => setLabelValue(ev.currentTarget.value)}
          />
          <div className='text-12 text-blueGray-400'>
            不超过 100 个字符，选项集名称不可重复。
          </div>
        </div>
      )}
      okText='保存'
      cancelText='取消'
      onCancel={() => setLabelValue(label)}
      onOk={() => {
        type === 'tree' ?
          store.handleChangeField(nodePath, 'label', labelValue) :
          store.handleChangeListField(idx, 'label', labelValue);
      }}
    >
      <span
        className='pl-12'
        onClick={() => {
          setLabelValue(label);
        }}
      >
        <Icon name="create" size={16} className='hover:text-blue-600' />
      </span>
    </Popconfirm>
  );
}

export default observer(EditOptionSetItem);

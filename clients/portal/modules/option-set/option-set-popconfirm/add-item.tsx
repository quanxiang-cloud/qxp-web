import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { isEqual } from 'lodash';

import { generateRandomFormFieldID as genId } from '@c/form-builder/utils';
import Popconfirm from '@c/pop-confirm';
import Icon from '@c/icon';
import toast from '@lib/toast';

import store from '../store';

interface Props {
  type: 'tree' | 'list';
  prefix?: string;
}

function AddOptionSetItem({ type, prefix = '' }: Props): JSX.Element {
  const [label, setLabel] = useState('');

  const handleListAddConfirm = (): void => {
    const dataName = label.split(/[(\r\n)\r\n]+/);
    const labels = dataName.filter((itm) => itm !== '').map((itm) => {
      return { label: itm, value: genId() };
    });
    store.addListItem(labels);
    setLabel('');
  };

  const handleTreeAddConfirm = (prefix: string): void => {
    const dataName = label.split(/[(\r\n)\r\n]+/);
    const labels = dataName.filter((itm) => itm !== '');
    if (isEqual(labels, [])) {
      toast.error('数据未更改');
      return;
    }
    store.addSubNode(labels, prefix);
    setLabel('');
  };

  return (
    <Popconfirm
      content={(
        <div className='option-set-popper text-gray-600'>
          <div>选项数据名称</div>
          <textarea
            maxLength={100}
            rows={3}
            className='my-8'
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <div>每行对应一个选项。</div>
          <div>选项数据名称不可重复。</div>
          <div>每个选项名称不超过100字符。</div>
        </div>
      )}
      okText='保存'
      cancelText='取消'
      onCancel={() => setLabel('')}
      onOk={
        type === 'tree' ?
          () => handleTreeAddConfirm(prefix) : handleListAddConfirm
      }
    >
      <span
        className='items-center pl-12 py-8 mt-8 hover:bg-blue-100 cursor-pointer hover:text-blue-600'
      >
        <Icon name='add' size={20} className='items-center pb-3 text-current'/>
        <span className='ml-6'>
          添加选项数据
        </span>
      </span>
    </Popconfirm>
  );
}

export default observer(AddOptionSetItem);

import React from 'react';
import { observer } from 'mobx-react';
import { Popconfirm } from 'antd';

import Icon from '@c/icon';

import store from '../store';

interface Props {
  type: 'tree' | 'list';
  idx?: number;
  nodePath?: string;
  prefix?: string;
}

function DeleteOptionSetItem({ type, idx = 0, nodePath = '', prefix = '' }: Props): JSX.Element {
  return (
    <Popconfirm
      title={(
        <div className='w-316'>
          <div className='mb-8 text-yellow-600'>
            确定要删除该选项数据吗？
          </div>
          <div className='text-gray-900'>
            如果该选项数据已被表单调用，删除后，表单将无法选择到该选项数据。
          </div>
        </div>
      )}
      okText='确定删除'
      cancelText='取消'
      okButtonProps={{ shape: 'round' }}
      cancelButtonProps={{ shape: 'round' }}
      onConfirm={() => {
        type === 'tree' ?
          store.removeItem(nodePath) :
          store.removeListItem(idx);
        store.path = prefix;
      }}
    >
      <span className='pl-12'>
        <Icon name='restore_from_trash' size={16} className='hover:text-blue-600' />
      </span>
    </Popconfirm>
  );
}

export default observer(DeleteOptionSetItem);

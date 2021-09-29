import React from 'react';
import { Popconfirm } from 'antd';
import { observer } from 'mobx-react';

import Icon from '@c/icon';

import store from '../store';

interface Props {
  zhCNLevel: string;
  prefix: string;
}

function RemoveOptionSetItems({ zhCNLevel, prefix }: Props): JSX.Element {
  return (
    <Popconfirm
      title={(
        <div className='w-316'>
          <div className='text-yellow-600'>
            确定要删除{zhCNLevel}级可选项吗？
          </div>
          <div className='text-gray-900'>
            删除{zhCNLevel}级可选会同时删除该可选项下包含的所有子集。
            如果该选项数据已被表单调用，删除后，表单将无法选择到该选项数据。
          </div>
        </div>
      )}
      okText='确定删除'
      cancelText='取消'
      okButtonProps={{ shape: 'round' }}
      cancelButtonProps={{ shape: 'round' }}
      onConfirm={() => {
        store.removeAllItem(prefix);
      }}
    >
      <span className='pl-12'>
        <Icon name='restore_from_trash' size={16} className='cursor-pointer hover:text-blue-600' />
      </span>
    </Popconfirm>
  );
}

export default observer(RemoveOptionSetItems);

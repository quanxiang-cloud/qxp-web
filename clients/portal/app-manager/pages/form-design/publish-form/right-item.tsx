import React from 'react';

import Icon from '@c/icon';

import RightSetting from './right-setting';
import './index.scss';

type Props = {
  right: any;
  actions: (key: string, right: any) => void
}

function RightItem({ right, actions }: Props) {
  return (
    <div className='pb-form-right-item'>
      <div className='pb-form-right-title'>
        <span className='text-h5 mr-8'>{right.title}</span>
        <span className='flex-1 text-caption-no-color text-gray-600'>{right.desc}</span>
        <p className='pb-form-right-action flex gap-x-16'>
          <span>复制</span>
          <span>修改</span>
          {right.dep.length && right.users.length ? (
            <span onClick={() => actions('del', right)}>删除</span>
          ) : null}
        </p>
      </div>
      <RightSetting />
      <div className='p-20'>
        <div className='mb-4'>
          <div className='items-center py-4 px-8 cursor-pointer hover:text-blue-600 inline-flex'>
            <Icon className='mr-4 app-icon-color-inherit' name='add' />
            添加员工与部门
          </div>
        </div>
        <div className='flex gap-8 flex-wrap'>
          {right.users.map(({ name }: any) => (
            <p className='pb-form-right-user' key={name}>{name}</p>
          ))}
          {right.dep.map(({ name }: any) => (
            <p className='pb-form-right-dep' key={name}>{name}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RightItem;

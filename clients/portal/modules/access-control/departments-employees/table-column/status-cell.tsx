import React from 'react';

import { UserStatus } from '../type';

interface Props {
  user: Employee;
}

export default function StatusCell({ user }: Props): JSX.Element {
  if (user.useStatus === UserStatus.normal) {
    return (
      <div className='flex items-center'>
        <div className="w-6 h-6 bg-green-600 rounded-6 mr-10"></div>
        <span>正常</span>
      </div>
    );
  }
  if (user.useStatus === UserStatus.disable) {
    return (
      <div className='flex items-center'>
        <div className="w-6 h-6 bg-red-600 rounded-6 mr-10"></div>
        <span>已禁用</span>
      </div>
    );
  }
  return (
    <div className='flex items-center'>
      <div className="w-6 h-6 bg-yellow-600 rounded-6 mr-10"></div>
      <span>已删除</span>
    </div>
  );
}

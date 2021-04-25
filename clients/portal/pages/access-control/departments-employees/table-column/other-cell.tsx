import React from 'react';

import { UserStatus } from '../type';

interface Props {
  columnKey: 'phone' | 'email' | 'dep';
  user: Employee;
}

export default function OtherCell({ columnKey, user: userinfo }: Props) {
  const isDisable = userinfo.useStatus === UserStatus.disable;

  return (
    <span className={['mr-1', isDisable ? 'text-gray-400' : null].join(' ')}>
      {columnKey === 'dep' ? userinfo['dep']?.departmentName : userinfo[columnKey]}
    </span>
  );
}

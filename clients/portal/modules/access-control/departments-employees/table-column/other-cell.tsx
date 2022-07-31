import React from 'react';

import { UserStatus } from '../type';
import { getTwoDimenArrayHead } from '@lib/utils';

interface Props {
  columnKey: 'phone' | 'email' | 'dep';
  user: Employee;
}

export default function OtherCell({ columnKey, user: userinfo }: Props) {
  const isDisable = userinfo.useStatus === UserStatus.disable;
  const dep = getTwoDimenArrayHead(userinfo['departments']);

  return (
    <span className={['mr-1', isDisable ? 'text-gray-400' : null].join(' ')}>
      {columnKey === 'dep' ? dep?.name : userinfo[columnKey]}
    </span>
  );
}

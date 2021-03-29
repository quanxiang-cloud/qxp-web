import React from 'react';

import { UserInfo } from '@portal/api/auth';
import { UserStatus } from '../enum';

interface Props {
  columnKey: 'phone' | 'email' | 'dep';
  userinfo: UserInfo;
}

export default function OtherColumn({ columnKey, userinfo }: Props) {
  return (
    userinfo.useStatus === UserStatus.disable ?
      <span className="mr-1 text-gray-400">
        {columnKey === 'dep' ? userinfo['dep']?.departmentName : userinfo[columnKey]}
      </span>:
      <span className="mr-1">
        {columnKey === 'dep' ? userinfo['dep']?.departmentName : userinfo[columnKey]}
      </span>
  );
}

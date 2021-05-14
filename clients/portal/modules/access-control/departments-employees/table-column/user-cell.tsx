import React from 'react';

import Avatar from '@c/avatar';

import { UserStatus } from '../type';

interface Props {
  user: Employee;
}

export default function UserCell({ user }: Props) {
  return (
    <div className="flex items-center">
      <div className="pr-8 relative">
        <Avatar
          username={user.userName}
          size={24}
        />
        <div className="w-10 h-10 bg-white rounded-10 flex items-center
                justify-center absolute -bottom-2 right-3">
          {user.useStatus === UserStatus.normal && (
            <div className="w-6 h-6 bg-green-600 rounded-6"></div>
          )}
          {user.useStatus === UserStatus.disable && (
            <div className="w-6 h-6 bg-red-600 rounded-6"></div>
          )}
        </div>
      </div>

      {user.useStatus === UserStatus.disable ?
        <span className="mr-1 text-gray-400">{user.userName}</span> :
        <span className="mr-1">{user.userName}</span>}
      {user.isDEPLeader === UserStatus.normal && (
        <span
          className='bg-jb rounded-4 ml-4 px-2 flex items-center justify-center'
        >
          <span className="text-white text-12">主管</span>
        </span>
      )}
    </div>
  );
}

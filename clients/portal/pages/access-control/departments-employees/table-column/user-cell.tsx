import React from 'react';

// todo refactor
import { getImgColor } from '../utils';
import { UserStatus } from '../type';

interface Props {
  user: UserInfo;
}

export default function UserCell({ user }: Props) {
  const firstLetter: string = user.userName.substring(0, 1);
  const imgInfo = getImgColor(firstLetter);

  return (
    <div className="flex items-center">
      <div className="pr-8">
        <div className="relative w-24 h-24 rounded-br-4 rounded-l-4
              text-center leading-24 text-white text-14"
        style={{
          backgroundColor: imgInfo.color,
        }}
        >
          {imgInfo.name}
          <div className="w-10 h-10 bg-white rounded-10 flex items-center
                justify-center absolute -bottom-5 -right-5">
            {user.useStatus === UserStatus.normal && (
              <div className="w-6 h-6 bg-green-600 rounded-6"></div>
            )}
            {user.useStatus === UserStatus.disable && (
              <div className="w-6 h-6 bg-red-600 rounded-6"></div>
            )}
          </div>
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

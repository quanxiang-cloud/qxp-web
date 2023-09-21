import React from 'react';

import Icon from '@c/icon';
import Avatar from '@c/avatar';

interface Props {
  userList: OperationRecord[];
  clickHandle: () => void;
  showIcon?: boolean;
  showName?: boolean;
}

export default function UserList({ userList, clickHandle, showIcon = true, showName }: Props): JSX.Element {
  return (
    <div
      className="bg-white corner-2-8-8-8 mt-9 px-16 pt-8 pb-4 flex justify-between cursor-pointer"
      onClick={clickHandle}
    >
      <div className="flex flex-wrap">
        {
          userList.map((user: any, index: number) => {
            const username = user.creatorName ? user.creatorName?.substring(0, 1) : '';
            return (
              <div key={index} className="mr-4 mb-4 flex">
                <Avatar username={username} />
                {showName &&
                  <span className="ml-4 text-gray-600">{user?.creatorName}</span>
                }
              </div>
            );
          })
        }
      </div>
      {
        showIcon &&
        (<div>
          <Icon name="chevron_right"/>
        </div>)
      }
    </div>
  );
}

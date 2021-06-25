import React from 'react';

import Icon from '@c/icon';
import Avatar from '@c/avatar';

interface Props {
  userList: OperationRecord[];
  clickHandle: () => void;
}

export default function UserList({ userList, clickHandle }: Props) {
  return (
    <div className="bg-white corner-2-8-8-8 mt-9 px-16 py-8 flex justify-between">
      <div className="flex">
        {
          userList.map((user: any, index: number) => {
            const username = user.creatorName ? user.creatorName.substring(0, 1) : '';
            return (
              <React.Fragment key={index}>
                <Avatar username={username} />
                {index !== (userList.length - 1) && <div className="w-4"></div>}
              </React.Fragment>
            );
          })
        }
      </div>
      <div>
        <Icon name="chevron_right" onClick={clickHandle} />
      </div>
    </div>
  );
}

import React from 'react';

import Icon from '@c/icon';
import Avatar from '@c/avatar';

interface Props {
  userList: OperationRecord[];
  clickHandle: () => void;
}

export default function UserList({ userList, clickHandle }: Props): JSX.Element {
  return (
    <div className="bg-white corner-2-8-8-8 mt-9 px-16 pt-8 pb-4 flex justify-between">
      <div className="flex flex-wrap">
        {
          userList.map((user: any, index: number) => {
            const username = user.creatorName ? user.creatorName.substring(0, 1) : '';
            return (
              <div key={index} className="mr-4 mb-4">
                <Avatar username={username} />
              </div>
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

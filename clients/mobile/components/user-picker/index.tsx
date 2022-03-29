import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';

import Icon from '@m/qxp-ui-mobile/icon';
import { userOrgPickerPath } from '@m/constant';

import './index.scss';

interface UserPickerProps {
    title: string;
    defaultValue?: UserApi.IUser[];
    single?: boolean;
    onChange?: (val: Array<string>) => void;
}

function UserPicker({ title, single = false, onChange }: UserPickerProps): JSX.Element {
  const history = useHistory();
  const [userList, setUserList] = useState<Array<string>>([]);

  useEffect(() => {
    setUserList((history.location.state || []) as Array<string>);
  }, []);

  useEffect(() => {
    const userIdList = userList.map((userItem) => userItem.split('_')[1]);
    onChange?.(userIdList);
  }, [userList]);

  function handleClick(): void {
    history.push(
      userOrgPickerPath + `?title=${title}&single=${single}`, { curPath: history.location, userList },
    );
  }

  return (
    <>
      <div className='w-100 person-list'>
        {userList.length > 0 && userList.map((userItem, index) => {
          return (
            <>
              {index < 2 && (
                <div key={userItem} className='person-item'>
                  <div className='person-img'>
                    <Icon name='m-action_person' size='0.16rem'/>
                  </div>
                  <span className='person-name'>{userItem.split('_')[0]}</span>
                </div>
              )}
            </>
          );
        })}
        {userList.length > 2 && (
          <div className='checked-list-info' onClick={handleClick}>
            <div className='mr-5'>等{userList.length}人</div>
            <Icon name='keyboard_arrow_right' style={{ color: '#475569' }}/>
          </div>
        )}
        {(!userList.length || userList.length < 3) && (
          <div
            className='add-outline'
            onClick={handleClick}
          >
            <Icon name='add' size='0.3rem' style={{ color: '#CBD5E1' }} />
          </div>
        )}
      </div>
    </>
  );
}

export default observer(UserPicker);

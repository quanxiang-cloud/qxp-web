import React, { useEffect } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';

import Icon from '@c/icon';
import store from '@home/pages/app-details/store';

function RoleList(): JSX.Element {
  const { getRoleInfo, roleOptions, currentRoleInfo, handleRoleChange, setAppID } = store;

  useEffect(() => {
    if (!window.APP_ID) {
      return;
    }

    setAppID(window.APP_ID);
    getRoleInfo(window.APP_ID);
  }, [window.APP_ID]);

  return (
    <div className='pt-4 px-20 hidden role-list'>
      {roleOptions.map(({ label, value }) => {
        const isActive = value === currentRoleInfo.roleID;

        return (
          <div
            key={value}
            className={cs('pt-4', { 'text-blue-600': isActive })}
            onClick={() => handleRoleChange(value, label)}
          >
            {label}
            {isActive && <Icon className='ml-20' name='check' />}
          </div>
        );
      })}
    </div>
  );
}

export default observer(RoleList);

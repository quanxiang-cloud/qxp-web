import React from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';

import Icon from '@c/icon';
import store from '@home/pages/app-details/store';

type Props = {
  visible: boolean;
}

function RoleList({ visible }: Props): JSX.Element | null {
  const { roleOptions, currentRoleInfo, handleRoleChange } = store;

  if (!visible) {
    return null;
  }

  return (
    <div className={cs('role-list')}>
      {!roleOptions.length && <span className='pt-4'>暂无角色</span>}
      {!!roleOptions.length && roleOptions.map(({ label, value }) => {
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

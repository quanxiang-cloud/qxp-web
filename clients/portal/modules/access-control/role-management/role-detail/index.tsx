import React from 'react';
import { useQuery } from 'react-query';

import Tab from '@c/tab';
import Loading from '@c/loading';

import { getRoleFunctions } from '../api';
import AlterRoleFunc from './alter-role-func';
import AssociateDepartmentEmployee from './associate-department-employee';
import { IRoleListItem } from '../role-list-item';

export interface Props {
  role?: IRoleListItem;
}

export default function RoleDetail({ role }: Props): JSX.Element {
  const { data, isLoading } = useQuery(['getRoleFunctions', role?.id], getRoleFunctions, {
    refetchOnWindowFocus: false,
    enabled: !!role?.id,
    cacheTime: -1,
  });

  if (isLoading || !data?.func || !role) {
    return <Loading desc="加载中..." />;
  }

  return (
    <Tab
      navsClassName='px-12'
      className="pt-8 flex-1 role-tab"
      contentClassName="rounded-12 rounded-tl-none w-full"
      items={[
        {
          id: 'association',
          name: '关联员工与部门',
          content: (
            <AssociateDepartmentEmployee
              roleID={role.id}
              isSuper={role.tag === 'super'}
            />
          ),
        },
        {
          id: 'func',
          name: '功能权限',
          content: (
            <AlterRoleFunc
              lastSaveTime={data.lastSaveTime}
              funcs={data.func}
              tag={role.tag}
              id={role.id}
            />
          ),
        },
      ]}
    />
  );
}

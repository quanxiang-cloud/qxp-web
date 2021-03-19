import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { twCascade } from '@mariusmarais/tailwind-cascade';

import { Card } from '@portal/components/Card';
import { RoleList } from './RoleList';
import { RoleDetail } from './RoleDetail';
import { getRolesList } from './api';
import Role from './role';

export interface IRoleManagement {
  visible: boolean;
}

export const RoleManagement = React.memo(({ visible }: IRoleManagement) => {
  const { data = [], isLoading } = useQuery('getRolesList', getRolesList, {
    refetchOnWindowFocus: false,
    enabled: !!visible,
  });
  const [roleId, setRoleId] = useState<string | number>('');
  useEffect(() => {
    if (data.length) {
      setRoleId(data[0].id);
    }
  }, [data]);

  const roleList = data.map(({ tag, name, id }) => new Role(name, id, tag));

  if (isLoading || !data.length) {
    return null;
  }

  return (
    <Card
      className={
        twCascade('ml-0 mt-0 mr-0 mb-0',
            'transition-opacity flex flex-col', {
              visible: visible,
              invisible: !visible,
              'opacity-0': !visible,
              'opacity-100': visible,
              'pointer-events-none': !visible,
              'pointer-events-auto': visible,
              'h-0': !visible,
              'h-auto': visible,
              'overflow-hidden': !visible,
              'flex-none': !visible,
              'flex-1': visible,
              'px-4 pt-dot-8 pb-dot-8': visible,
            })}
      headerClassName="bg-F1F5F9-dot-5 -mx-4 -mt-dot-8 px-4 py-dot-8 pt-0 header-background-image"
      title="角色管理"
      desc="可以定义平台内的账号拥有的权限。"
      action={<a className="ease-linear text-dot-7 underline text-324558">📌 如何管理角色？</a>}
    >
      <div className="flex flex-row items-stretch h-full">
        <div className="flex-1 pt-4 pb-4">
          <RoleList items={roleList} onChange={setRoleId} />
        </div>
        <div className="vertical-line flex-grow-0"></div>
        <div className="flex-2-dot-8 p-4">
          <RoleDetail id={roleId} role={roleList.find(({ id }) => id == roleId) as Role} />
        </div>
      </div>
    </Card>
  );
});

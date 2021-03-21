import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { twCascade } from '@mariusmarais/tailwind-cascade';

import { Card } from '@portal/components/card';
import { RoleList } from './role-list';
import { RoleDetail } from './role-detail';
import { getRolesList } from './api';
import Role from './role';

export default function RoleManagement() {
  const { data = [], isLoading } = useQuery('getRolesList', getRolesList, {
    refetchOnWindowFocus: false,
    enabled: true,
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
      className="ml-0 mt-0 mr-0 mb-0 transition-opacity flex flex-col
      flex-1 pt-dot-8 pb-dot-8"
      headerClassName="bg-F1F5F9-dot-5 -mx-4 -mt-dot-8 px-8 py-dot-8
      pt-0 header-background-image h-5-dot-6"
      title="角色管理"
      desc="可以定义平台内的账号拥有的权限。"
      action={<a className="ease-linear text-1-dot-4 underline text-324558">📌 如何管理角色？</a>}
    >
      <div className="flex flex-row items-stretch h-full">
        <div className="flex-1 pt-4 pb-4">
          <RoleList items={roleList} onChange={setRoleId} />
        </div>
        <div className="vertical-line flex-grow-0"></div>
        <div className="flex-2-dot-8 p-8">
          <RoleDetail id={roleId} role={roleList.find(({ id }) => id == roleId) as Role} />
        </div>
      </div>
    </Card>
  );
}

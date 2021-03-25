import React, { useState, useEffect } from 'react';
import useCss from 'react-use/lib/useCss';
import { useQuery } from 'react-query';

import Card from '@portal/components/card2';
import { RoleList } from './role-list';
import { RoleDetail } from './role-detail';
import { getRoles } from './api';

export default function RoleManagement() {
  const { data: roleList = [], isLoading } = useQuery('getRoles', getRoles, {
    refetchOnWindowFocus: false,
  });
  const [roleId, setRoleId] = useState<string | number>('');
  useEffect(() => {
    if (roleList.length) {
      setRoleId(roleList[0].id);
    }
  }, [roleList]);

  const contentHeight = useCss({
    height: 'calc(100% - 56px)',
  });

  if (isLoading || !roleList.length) {
    return null;
  }

  return (
    <Card
      className="ml-0 mt-0 mr-0 mb-0 transition-opacity flex flex-col
      flex-1 pt-dot-8 pb-dot-8"
      headerClassName="bg-gray-200-dot-5 -mt-dot-8 px-8 py-8
      pt-0 header-background-image h-5.6"
      title="角色管理"
      desc="可以定义平台内的账号拥有的权限。"
      action={<a className="ease-linear text-1-dot-4 underline text-gray-600">📌 如何管理角色？</a>}
      contentClassName={contentHeight}
    >
      <div className="flex flex-row items-stretch h-full">
        <div className="flex-1 pb-4">
          <RoleList items={roleList} onChange={setRoleId} />
        </div>
        <div className="vertical-line flex-grow-0"></div>
        <div className="flex-2-dot-8 p-8">
          <RoleDetail role={roleList.find(({ id }) => id == roleId)} />
        </div>
      </div>
    </Card>
  );
}

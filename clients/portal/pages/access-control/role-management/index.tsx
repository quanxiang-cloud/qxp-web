import React, { useState, useEffect } from 'react';
import useCss from 'react-use/lib/useCss';
import { useQuery } from 'react-query';

import Card from '@portal/components/card2';
import { Error } from '@c/error2';
import { usePortalGlobalValue } from '@clients/common/state/portal';

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
  const [{ userInfo }] = usePortalGlobalValue();

  const contentHeight = useCss({
    height: 'calc(100% - 56px)',
  });

  if (isLoading || !roleList.length) {
    return null;
  }
  if (!userInfo.authority.includes('accessControl/role/read')) {
    return <Error desc="您没有权限, 请联系管理员..." />;
  }

  return (
    <Card
      className="transition-opacity flex flex-col flex-1 mt-0"
      headerClassName="bg-gray-1000 px-20 py-16 header-background-image h-56"
      title="角色管理"
      itemTitleClassName="text-h5"
      desc="可以定义平台内的账号拥有的权限。"
      action={<a className="ease-linear text-underline">📌 如何管理角色？</a>}
      contentClassName={contentHeight}
      descClassName="text-caption"
    >
      <div className="flex flex-row items-stretch h-full">
        <div className="pb-4 w-259">
          <RoleList items={roleList} onChange={setRoleId} />
        </div>
        <div className="vertical-line flex-grow-0"></div>
        <div className="flex-1 p-20 pb-0">
          <RoleDetail role={roleList.find(({ id }) => id == roleId)} />
        </div>
      </div>
    </Card>
  );
}

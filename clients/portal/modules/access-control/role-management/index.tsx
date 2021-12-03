import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';

import ErrorTips from '@c/error-tips';
import TextHeader from '@c/text-header';

import RoleList from './role-list';
import RoleDetail from './role-detail';
import { getRoles } from './api';

export default function RoleManagement(): JSX.Element | null {
  const { data: roleList = [], isLoading } = useQuery('getRoles', getRoles, {
    refetchOnWindowFocus: false,
  });
  const [roleId, setRoleId] = useState<string | number>('');
  useEffect(() => {
    document.title = '访问控制 - 角色管理';
    if (roleList.length) {
      setRoleId(roleList[0].id);
    }
  }, [roleList]);

  if (isLoading || !roleList.length) {
    return null;
  }
  if (!window.ADMIN_USER_FUNC_TAGS.includes('accessControl/role/read')) {
    return (
      <ErrorTips
        style={{ marginTop: '200px' }}
        desc="您没有权限, 请联系管理员..."
      />
    );
  }

  return (
    <div className="h-full flex flex-col flex-grow bg-white" >
      <TextHeader
        title='角色管理'
        desc="可以定义平台内的账号拥有的权限。"
        // action="❓ 如何管理通讯录？"
        className="bg-gray-1000 px-20 header-background-image border-b-1"
        itemTitleClassName="text-h5"
      />
      <div className="flex flex-grow items-stretch flex-1 overflow-hidden">
        <RoleList items={roleList} onChange={setRoleId} />
        <RoleDetail role={roleList.find(({ id }) => id === roleId)} />
      </div>
    </div>
  );
}

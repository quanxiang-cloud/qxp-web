import React from 'react';
import { useQuery } from 'react-query';

import ItemWithTitleDesc from '@c/item-with-title-desc';
import Tab from '@c/tab';
import Loading from '@c/loading';
import { getRoleFunctions } from '@portal/api/role-management';

import AlterRoleFunc from './alter-role-func';
import AssociateDepartmentEmployee from './associate-department-employee';
import { IRoleListItem } from '../role-list-item';

export interface IRoleDetail {
  role?: IRoleListItem;
}

export default function RoleDetail({ role }: IRoleDetail) {
  const { data, isLoading } = useQuery(['getRoleFunctions', role?.id], getRoleFunctions, {
    refetchOnWindowFocus: false,
    enabled: !!role?.id,
    cacheTime: -1,
  });

  if (isLoading || !data?.func || !role) {
    return <Loading desc="加载中..." />;
  }

  return (
    <>
      <ItemWithTitleDesc
        itemRender={
          <div className="text-h6-bold text-black-900 flex justify-between items-center">
            {role?.name}
          </div>
        }
        desc={
          role.tag === 'super' ?
            '平台默认的角色，默认具有企业所有功能权限和全部数据可见范围。' :
            '具有企业部分功能权限和部分数据可见范围。'
        }
        descClassName="transition ease-linear text-black-200 text-caption-no-color"
      />
      <Tab
        style={{ height: 'calc(100% - 24px)' }}
        className="mt-4 py-16"
        contentClassName="rounded-12 rounded-tl-none"
        items={[
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
          {
            id: 'association',
            name: '关联员工与部门',
            content: <AssociateDepartmentEmployee id={role.id} isSuper={role.tag === 'super'} />,
          },
        ]}
      />
    </>
  );
}

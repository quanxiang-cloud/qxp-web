import React from 'react';
import { useQuery } from 'react-query';

import { ItemWithTitleDesc } from '@portal/components/Item-with-title-desc';
import { Tab } from '@portal/components/tab';
import { Loading } from '@portal/components/loading';
import { IRoleListItem } from '../role-list-item';
import { AlterRoleFunc } from './alter-role-func';
import { AssociateDepartmentEmployee } from './associate-department-employee';
import { getRoleFunctions } from '../api';

export interface IRoleDetail {
  id: string | number;
  role: IRoleListItem;
}

export const RoleDetail = ({ role, id }: IRoleDetail) => {
  const { data, isLoading } = useQuery(['getRoleFunctions', id], getRoleFunctions, {
    refetchOnWindowFocus: false,
    enabled: !!id,
    cacheTime: -1,
  });

  if (isLoading || !data?.func || !role) {
    return <Loading desc="加载中..." />;
  }

  return (
    <div>
      <ItemWithTitleDesc
        itemRender={
          <div className="font-bold text-1-dot-6 text-0F172A flex justify-between items-center">
            {role?.name}
          </div>
        }
        desc={
          role.tag === 'super' ?
            '平台默认的角色，默认具有企业所有功能权限和全部数据可见范围。' :
            '具有企业部分功能权限和部分数据可见范围。'
        }
        descClassName="transition ease-linear text-1-dot-2 text-697886"
      />
      <Tab
        className="mt-4 py-dot-8 px-4"
        items={[
          {
            id: 'func',
            name: '功能权限',
            content: (
              <AlterRoleFunc
                lastSaveTime={data.lastSaveTime}
                funcs={data.func}
                tag={role.tag}
                id={id}
              />
            ),
          },
          {
            id: 'association',
            name: '关联员工与部门',
            content: <AssociateDepartmentEmployee id={id} isSuper={role.tag === 'super'} />,
          },
        ]}
      />
    </div>
  );
};

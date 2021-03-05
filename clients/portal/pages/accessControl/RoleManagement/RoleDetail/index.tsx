import React from 'react'
import { Loading } from '@QCFE/lego-ui'
import { useQuery } from 'react-query'

import { ItemWithTitleDesc } from '@portal/components/ItemWithTitleDesc'
import { Tab } from '@portal/components/Tab'
import { IRoleListItem } from '../RoleListItem'
import { AlterRoleFunc } from './AlterRoleFunc'
import { getRoleFunctions } from '../api'

export interface IRoleDetail {
  id: string | number
  role: IRoleListItem
}

export const RoleDetail = ({ role, id }: IRoleDetail) => {
  const { data, isLoading } = useQuery(['getRoleFunctions', id], getRoleFunctions, {
    refetchOnWindowFocus: false,
  })

  if (isLoading || !data?.func || !role) {
    return (
      <div className="flex justify-center items-center">
        <Loading />
      </div>
    )
  }

  return (
    <div>
      <ItemWithTitleDesc
        itemRender={() => (
          <div className="font-bold text-dot-8 text-0F172A flex justify-between items-center">
            {role?.name}
          </div>
        )}
        desc="这里显示用户自定义添加的描述信息，如果未添加，则不显示。"
        descClassName="transition-all duration-300 ease-linear text-dot-6 text-697886"
      />
      <Tab
        className="mt-4 py-dot-8 px-4"
        items={[
          {
            id: 'func',
            name: '功能权限',
            content: (
              <AlterRoleFunc lastSaveTime={data.lastSaveTime} funcs={data.func} tag={role.tag} />
            ),
          },
          {
            id: 'association',
            name: '关联员工与部门',
            content: <div>关联员工与部门</div>,
          },
        ]}
      />
    </div>
  )
}

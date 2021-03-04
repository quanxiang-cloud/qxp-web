import React from 'react'

import { Card } from '@portal/components/Card'
import { RoleList } from './RoleList'

export const RoleManagement = () => {
  return (
    <Card
      className="ml-0 mt-0 mr-0 mb-0 px-4 py-dot-8"
      headerClassName="bg-F1F5F9-dot-5 -mx-4 -mt-dot-8 px-4 py-dot-8 header-background-image"
      title="角色管理"
      desc="平台默认的角色，默认具有企业所有功能权限和全部数据可见范围。"
      action={
        <a className="transition-all duration-300 ease-linear text-dot-7 underline text-324558">
          📌 如何管理角色？
        </a>
      }
    >
      <div>
        <RoleList />
      </div>
    </Card>
  )
}

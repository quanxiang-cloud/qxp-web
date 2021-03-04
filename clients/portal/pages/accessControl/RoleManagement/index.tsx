import React from 'react'

import { Card } from '@portal/components/Card'
import { RoleList } from './RoleList'
import { RoleDetail } from './RoleDetail'

export const RoleManagement = () => {
  return (
    <Card
      className="ml-0 mt-0 mr-0 mb-0 px-4 pt-dot-8 pb-0"
      headerClassName="bg-F1F5F9-dot-5 -mx-4 -mt-dot-8 px-4 py-dot-8 header-background-image"
      title="角色管理"
      desc="平台默认的角色，默认具有企业所有功能权限和全部数据可见范围。"
      action={
        <a className="transition-all duration-300 ease-linear text-dot-7 underline text-324558">
          📌 如何管理角色？
        </a>
      }
    >
      <div className="flex flex-row items-stretch">
        <div className="flex-1 pt-4 pb-4">
          <RoleList />
        </div>
        <div className="vertical-line flex-grow-0"></div>
        <div className="flex-2-dot-8 p-4">
          <RoleDetail />
        </div>
      </div>
    </Card>
  )
}

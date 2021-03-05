import React from 'react'

import { ItemWithTitleDesc } from '@portal/components/ItemWithTitleDesc'
import { Tab } from '@portal/components/Tab'
import { IRoleListItem } from './RoleListItem'

export interface IRoleDetail {
  id: string | number
  role?: IRoleListItem
}

export const RoleDetail = ({ role }: IRoleDetail) => {
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
      <Tab className="mt-4 py-dot-8 px-4" />
    </div>
  )
}

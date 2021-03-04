import React from 'react'

import { ItemWithTitleDesc } from '@portal/components/ItemWithTitleDesc'

export const RoleDetail = () => {
  return (
    <div>
      <ItemWithTitleDesc
        itemRender={() => (
          <div className="font-bold text-dot-8 text-0F172A flex justify-between items-center">
            普通用户
          </div>
        )}
        desc="这里显示用户自定义添加的描述信息，如果未添加，则不显示。"
        descClassName="transition-all duration-300 ease-linear text-dot-6 text-697886"
      />
    </div>
  )
}

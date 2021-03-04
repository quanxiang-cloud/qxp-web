import React from 'react'
import useCss from 'react-use/lib/useCss'
import { twCascade } from '@mariusmarais/tailwind-cascade'

import { List } from '@portal/components/List'
import { ItemWithTitleDesc } from '@portal/components/ItemWithTitleDesc'
import { UUIDGeneratorBrowser } from '@assets/lib/f'
import { RoleListItem, IRoleListItem } from './RoleListItem'

export interface IRoleList {
  items: IRoleListItem[]
}

export const RoleList = () => {
  const items = [
    {
      id: UUIDGeneratorBrowser(),
      name: '超级管理员',
    },
    {
      id: UUIDGeneratorBrowser(),
      name: '普通用户',
    },
  ]

  return (
    <div>
      <ItemWithTitleDesc
        itemRender={() => (
          <div className="font-bold text-dot-8 text-0F172A flex justify-between items-center">
            角色列表
          </div>
        )}
        desc="(2 个)"
        descClassName="transition-all duration-300 ease-linear text-dot-6 text-697886"
      />
      <List
        className="flex-col justify-start items-stretch"
        itemClassName={twCascade(
          'py-dot-9 px-4 hover:bg-blue-light hover:text-blue-primary transition duration-300 cursor-pointer',
          useCss({
            svg: {
              fill: '#64748B',
            },
            '&:hover svg': {
              fill: '#8CADFF',
            },
            '&:hover *': {
              color: '#375FF3',
              'font-weight': 900,
            },
          }),
        )}
        items={items.map((item) => (
          <RoleListItem {...item} />
        ))}
      />
    </div>
  )
}

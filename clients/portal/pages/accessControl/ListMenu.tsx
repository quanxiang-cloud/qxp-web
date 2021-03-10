import React, { useState, useEffect } from 'react'
import useCss from 'react-use/lib/useCss'
import classnames from 'classnames'

type MenuItem = {
  id: string
  name: string
  icon: string
}

export interface IListMenu {
  menuData?: MenuItem[]
  onChange: (type: string) => void
  defaultType?: string
}

export const ListMenu = ({ onChange, defaultType }: IListMenu) => {
  const [type, setType] = useState<string | undefined>(defaultType)
  const menuData: MenuItem[] = [
    {
      id: 'corporateDirectory',
      icon: '/dist/images/user.svg',
      name: '企业通讯录',
    },
    {
      id: 'RoleManagement',
      icon: '/dist/images/role.svg',
      name: '角色管理',
    },
  ]

  useEffect(() => {
    onChange(type as string)
  }, [type])

  return (
    <ul className="w-auto">
      {menuData.map((item) => {
        return (
          <li
            key={item.id}
            onClick={() => setType(item.id)}
            className={classnames(
              'h-2-bot-8 leading-2-bot-8 rounded-l-dot-4 p-x-0-dot-9 flex relative cursor-pointer transition',
              useCss({
                '> div': {
                  display: 'none',
                },
                '&:hover': {
                  'background-color': '#F1F5F9',
                  '> span': {
                    color: '#0F172A',
                  },
                  '> div': {
                    display: 'block',
                  },
                },
                ...(type === item.id
                  ? {
                      'background-color': '#F1F5F9',
                      '> span': {
                        color: '#0F172A',
                      },
                      '> div': {
                        display: 'block',
                      },
                    }
                  : {}),
              }),
            )}
          >
            <img className="w-1-dot-2 h-1-dot-2 px-dot-4" src={item.icon} alt="logo" />
            <span className="fs-0-dot-8 text-94A3B8 text-dot-8">{item.name}</span>
            <div className="absolute top-0 right-0 w-0-dot-2 h-2-dot-8 bg-475569 rounded-l-dot-4"></div>
          </li>
        )
      })}
    </ul>
  )
}

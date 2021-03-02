import React from 'react'

import { Dropdown, Menu, Icon } from '@QCFE/lego-ui';

export const PersonalSettingMenu = () => {
  return (
    <Dropdown content={(
      <Menu>
        <Menu.MenuItem>个人中心</Menu.MenuItem>
        <Menu.MenuDivider />
        <Menu.MenuItem>
          <form action="/logout" method="post" className="w-full h-full">
              <button 
                type="submit"
                className="w-full h-full text-left"
              >
                登出
              </button>
          </form>
        </Menu.MenuItem>
      </Menu>
    )}>
      <div className="cursor-pointer">
        个人设置
        <Icon name="caret-down" />
      </div>
    </Dropdown>
  )
}

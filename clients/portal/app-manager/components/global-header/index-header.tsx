import React from 'react';

import More from '@c/more';
import Icon from '@c/icon';
import Button from '@appC/button';

import NavButton from '../nav-button';
import NotifyIcon from './notify-icon';

const NAV_LIST: Nav[] = [
  { name: '应用管理', icon: 'dashboard_customize', url: '/apps/list', active: true },
  { name: '访问控制', icon: 'add_task', url: '/access-control' },
  { name: '系统管理', icon: 'settings', url: '/appManager' },
];

const NAV_LIST_RIGHT = [
  { name: '帮助文档', icon: 'book', url: '' },
  {
    name: <More items={[
      <a
        href="/login/password"
        key={1}
        className="global-header-user-action text-button"
      >
        重置密码
      </a>,
      <a
        key={2}
        href='/logout'
        type="submit"
        className="global-header-user-action text-button"
      >
        登出
      </a>,
    ]}>
      个人中心
      <Icon name="expand_more" style={{ marginLeft: '8px' }} />
    </More>,
    icon: 'settings',
  },
];

function IndexHeader() {
  return (
    <div className="app-global-header app-global-header-icon">
      <div className='flex gap-x-20'>
        {NAV_LIST.map((navItem) => <NavButton key={navItem.icon} {...navItem} />)}
      </div>
      <div className='flex gap-x-20'>
        <Button icon='login'>
          进入访问端
        </Button>
        <NotifyIcon unreadNum={5} />
        {NAV_LIST_RIGHT.map((navRightItem) => {
          return <NavButton key={navRightItem.icon} {...navRightItem} />;
        })}
      </div>
    </div>
  );
}

export default IndexHeader;

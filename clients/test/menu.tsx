import React from 'react';

import MenuItem, { MenuItemType } from './menu-item';

const menus: Array<MenuItemType> = [
  {
    id: 'view_setting',
    title: '视图管理',
    // icon: 'view',
    children: [
      {
        id: 'page_setting',
        title: '页面管理',
        // icon: 'view',
      },
      {
        id: 'nav_setting',
        title: '导航管理',
        // icon: 'view',
      },
    ],
  },
  {
    id: 'modal_api',
    title: '数据管理',
    // icon: 'gateway',
    children: [
      {
        id: 'data_models',
        title: '数据模型管理',
        // icon: 'database',
      },
      {
        id: 'api_proxy',
        title: '第三方 API 代理',
        // icon: 'api_outside',
      },
      {
        id: 'orchestration_api',
        title: 'API 编排管理',
        // icon: 'api_arrange',
      },
      {
        id: 'faas',
        title: 'FaaS 函数管理',
        // icon: 'faas_control',
      },
      {
        id: 'key_api',
        title: 'API 密钥管理',
        // icon: 'api_key',
      },
      {
        id: 'file_api',
        title: 'API 文档',
        // icon: 'api_inner',
      },
    ],
  },
  {
    id: 'setting_flow',
    title: '工作流',
    // icon: 'data_model',
  },
  {
    id: 'app_control',
    title: '访问控制',
  },
  {
    id: 'base_info',
    title: '应用设置',
  },
];

function Menu(): JSX.Element {
  return (
    <div className='w-142'>
      {menus.map((menu) => (<MenuItem menu={menu} key={menu.id} level={1} maxLevel={2} />))}
    </div>
  );
}

export default Menu;


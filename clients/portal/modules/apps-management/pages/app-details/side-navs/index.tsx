import React, { useState } from 'react';
import cs from 'classnames';

import PageLoading from '@c/page-loading';
import { useGetGlobalConfig } from '@lib/configuration-center';

import TreeNode from './menu-tree-node';

import './index.scss';

export type Menu = {
  id: string;
  title: string;
  icon: string;
  externalLink?: string;
  children?: Array<Menu>;
}

const NAV_KEY = 'PORTAL_APPLICATION_SIDE_NAV';

const TEMP_NAV: Menu[] = [
  {
    id: 'app_views',
    title: '应用视图',
    icon: 'view',
    children: [
      {
        id: 'views',
        title: '页面管理',
        icon: 'database',
      },
      {
        id: 'view_layout',
        title: '母版管理',
        icon: 'database',
      },
      {
        id: 'app_nav',
        title: '应用导航',
        icon: 'database',
      },
    ],
  },
  {
    id: 'modal_api',
    title: '数据管理',
    icon: 'gateway',
    children: [
      {
        id: 'data_models',
        title: '数据模型管理',
        icon: 'database',
      },
      {
        id: 'api_proxy',
        title: '第三方 API 代理',
        icon: 'api_outside',
      },
      {
        id: 'orchestration_api',
        title: 'API 编排管理',
        icon: 'api_arrange',
      },
      {
        id: 'faas',
        title: 'FaaS 函数管理',
        icon: 'faas_control',
      },
      {
        id: 'key_api',
        title: 'API 密钥管理',
        icon: 'api_key',
      },
      {
        id: 'file_api',
        title: 'API 文档',
        icon: 'api_inner',
      },
    ],
  },
  {
    id: 'setting_flow',
    title: '工作流',
    icon: 'data_model',
  },
  {
    id: 'app_control',
    title: '访问控制',
    icon: 'role',
  },
  {
    id: 'base_info',
    title: '应用设置',
    icon: 'app_setting',
  },
];

export default function CollapseMenu(): JSX.Element {
  const [menuCollapse, setMenuCollapse] = useState(true);
  const [sideNav, loading] = useGetGlobalConfig<Array<Menu>>(NAV_KEY, '0.1.0', []);

  return (
    <div className='w-64 relative overflow-visible'>
      <div
        onMouseOver={() => {
          if (menuCollapse) setMenuCollapse(false);
        }}
        onMouseLeave={() => setMenuCollapse(true)}
        className={cs(
          'app-menu-tree w-64 h-full absolute left-0 top-0 overflow-x-hidden bg-white px-12',
          'z-z-5 pt-24 pb-0 ease-in-out duration-300 :hover:',
          { 'collapse overflow-y-hidden': menuCollapse },
        )}
      >
        {loading ? <PageLoading /> : (
          TEMP_NAV.map((menu) => {
            return (
              <TreeNode
                defaultCollapse={menuCollapse}
                menu={menu}
                key={menu.id}
                level={1}
                maxLevel={2}
              />
            );
          })
        )}
        {!loading && sideNav.length === 0 && (
          <div className='text-gray-400 text-center text-14'>暂无应用菜单，请联系管理员配置。</div>
        )}
      </div>
    </div>
  );
}


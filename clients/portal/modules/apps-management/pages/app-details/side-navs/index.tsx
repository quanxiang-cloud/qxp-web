import React, { useState } from 'react';
import { useQuery } from 'react-query';
import cs from 'classnames';

import TreeNode from './menu-tree-node';
import { fetchSideNavExternalLinks } from './api';

import './index.scss';

export type Menu = {
  id: string;
  title: string;
  icon: string;
  externalLink?: string;
  children?: Array<Menu>;
}

const SIDE_NAV: Array<Menu> = [
  {
    id: 'page_setting',
    title: '视图管理',
    icon: 'view',
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
  const { data: externalLinks } = useQuery('FETCH_SIDE_NAV_EXTERNAL_LINKS', () => {
    return fetchSideNavExternalLinks();
  });

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
        {SIDE_NAV.concat(externalLinks || []).map((menu) => {
          return <TreeNode defaultCollapse={menuCollapse} menu={menu} key={menu.id} level={1} maxLevel={2} />;
        })}
      </div>
    </div>
  );
}


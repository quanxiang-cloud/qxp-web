import React, { useState } from 'react';
import cs from 'classnames';

import TreeNode from './menu-tree-node';

import './index.scss';

const SIDE_NAV = [
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
        title: '第三方API代理',
        icon: 'api_proxy',
      },
      {
        id: 'file_api',
        title: 'API文档',
        icon: 'api_doc',
      },
      {
        id: 'key_api',
        title: 'API密钥管理',
        icon: 'api_key',
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
  {
    id: 'rdp',
    title: '报表管理',
    icon: 'trending_up',
  },
  {
    id: 'obddp',
    title: '大屏管理',
    icon: 'airplay',
  },
  {
    id: 'rdpDataConfig',
    title: '数据源管理',
    icon: 'all_inclusive',
  },
];

export default function CollapseMenu(): JSX.Element {
  const [menuCollapse, setMenuCollapse] = useState(true);
  return (
    <div className='w-64 relative overflow-visible'>
      <div
        onMouseEnter={() => setMenuCollapse(false)}
        onMouseLeave={() => setMenuCollapse(true)}
        className={cs(
          'app-menu-tree w-64 h-full absolute left-0 top-0 overflow-x-hidden bg-white px-12',
          'z-z-5 pt-24 pb-0 ease-in-out duration-300 :hover:',
          { 'collapse overflow-y-hidden': menuCollapse },
        )}
      >
        {SIDE_NAV.map((menu) => {
          return <TreeNode defaultCollapse={menuCollapse} {...menu} key={menu.id} level={1} maxLevel={2} />;
        })}
      </div>
    </div>
  );
}


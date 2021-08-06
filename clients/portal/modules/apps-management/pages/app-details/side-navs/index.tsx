import React from 'react';
import cs from 'classnames';
import { useParams, useHistory } from 'react-router-dom';

import Icon from '@c/icon';

import './index.scss';

const SIDE_NAVS = [
  {
    id: 'page',
    title: '业务页面',
    nav_items: [
      {
        id: 'page_setting',
        name: '页面及菜单设计',
        icon: 'image',
      },
      {
        id: 'custom_page',
        name: '自定义页面',
        icon: 'settings',
      },
    ],
  },
  {
    id: 'logic',
    title: '业务逻辑',
    nav_items: [
      {
        id: 'setting_flow',
        name: '工作流设计',
        icon: 'image',
      },
    ],
  },
  {
    id: 'modal_api',
    title: '模型及API',
    nav_items: [
      {
        id: 'data_modal',
        name: '数据模型管理',
        icon: 'insights',
      },
      {
        id: 'file_api',
        name: 'API文档',
        icon: 'link',
      },
    ],
  },
  {
    id: 'application',
    title: '应用管理',
    nav_items: [
      {
        id: 'base_info',
        name: '应用基本信息',
        icon: 'settings',
      },
      {
        id: 'app_permission',
        name: '应用授权',
        icon: 'image',
      },
      {
        id: 'app_manager',
        name: '应用管理员',
        icon: 'settings',
      },
    ],
  },
];

function SideNavs(): JSX.Element {
  const history = useHistory();
  const { appID, menuType } = useParams<{ appID: string, menuType: string }>();

  return (
    <div className='app-side-nav p-20'>
      {
        SIDE_NAVS.map(({ id, title, nav_items }) => {
          return (
            <div key={id}>
              <div className="text-h5 py-10">{title}</div>
              {nav_items.map(({ id, name, icon }) => {
                return (
                  <div
                    key={id}
                    onClick={() => history.push(`/apps/details/${appID}/${id}`)}
                    className={cs('px-20 py-10 flex items-center side-nav-focus', {
                      'bg-gray-100': id === menuType,
                      'text-blue-600': id === menuType,
                    })}
                  >
                    <Icon name={icon} className="mr-8 text-current flex-shrink-0" size={24} />
                    <span>{name}</span>
                  </div>
                );
              })}
            </div>
          );
        })
      }
    </div>
  );
}

export default SideNavs;

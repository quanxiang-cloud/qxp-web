import React from 'react';
import cs from 'classnames';
import { useParams, useHistory } from 'react-router-dom';

import Icon from '@c/icon';

import './index.scss';

const SIDE_NAVS = [
  {
    id: 'page',
    title: '业务页面',
    icon: 'folder',
    nav_items: [
      {
        id: 'page_setting',
        name: '页面与菜单管理',
      },
      // {
      //   id: 'custom_page',
      //   name: '自定义页面',
      // },
    ],
  },
  {
    id: 'logic',
    title: '业务逻辑',
    icon: 'crop',
    nav_items: [
      {
        id: 'setting_flow',
        name: '工作流设计',
      },
    ],
  },
  {
    id: 'modal_api',
    title: '模型及API',
    icon: 'api',
    nav_items: [
      {
        id: 'data_models',
        name: '数据模型管理',
      },
      {
        id: 'api_proxy',
        name: '第三方API代理',
        icon: 'link',
      },
      {
        id: 'file_api',
        name: 'API文档',
      },
    ],
  },
  {
    id: 'application',
    title: '应用管理',
    icon: 'settings_applications',
    nav_items: [
      {
        id: 'base_info',
        name: '基本信息',
      },
      {
        id: 'app_permission',
        name: '业务功能授权',
      },
      {
        id: 'app_manager',
        name: '管理功能授权',
      },
    ],
  },
];

function SideNavs(): JSX.Element {
  const history = useHistory();
  const { appID, menuType } = useParams<{ appID: string, menuType: string }>();

  function renderNavItem(
    id: string, title:string, icon: string, nav_items: Array<Record<string, string | undefined>>,
  ): JSX.Element {
    return (
      <div key={id} className="select-none text-gray-600 text-16">
        <div
          className="p-16 flex justify-between"
        >
          <div className="flex items-center">
            <Icon name={icon} className="mr-4 text-current flex-shrink-0" size={21} />
            {title}
          </div>
        </div>
        <div>
          {nav_items.map(({ id: subMenuId, name }) => {
            return (
              <div
                key={subMenuId}
                onClick={() => history.push(`/apps/details/${appID}/${subMenuId}`)}
                className={cs('py-8 side-nav-focus cursor-pointer relative', {
                  'side-nav-active': subMenuId === menuType,
                })}
              >
                <span className="ml-40">{name}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className='app-side-nav py-16'>
      {SIDE_NAVS.map(({ id, title, icon, nav_items }) => {
        return renderNavItem(id, title, icon, nav_items);
      })}
    </div>
  );
}

export default SideNavs;

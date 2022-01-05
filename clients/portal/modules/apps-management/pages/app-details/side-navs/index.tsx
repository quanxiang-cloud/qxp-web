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
          sideNav.map((menu) => {
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
          <div className='text-gray-400 text-center text-14'>暂无有权限的菜单，请联系管理员。</div>
        )}
      </div>
    </div>
  );
}


import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { isEmpty } from 'lodash';
import cs from 'classnames';

import { css, getLITarget } from './utils';
import appPagesStore from '@portal/modules/apps-management/pages/app-details/store';
import { MenuType } from '@portal/modules/apps-management/pages/app-details/type';
import MenuLabel from './menu-label';
import MenuTree from './menu-tree';
import MenuOp from './menu-op';
import { Menu } from './type';
import './index.scss';

type Props = {
  menu: Menu;
  className?: string;
  handleMenuClick?: (key: string, treeItem: Menu) => void;
}

function NestMenu(props: Props): JSX.Element {
  const { menu: { child = [], menuType } } = props;
  if (isEmpty(child) && menuType !== MenuType.group) {
    return <></>;
  }
  if (isEmpty(child) && menuType === MenuType.group) {
    return <ul className='submenu'></ul>;
  }
  return (
    <MenuTree
      {...props}
      className='submenu'
      menus={(child || []).sort((a, b) => (a?.sort || 0) - (b?.sort || 0))}
    />
  );
}

function MenuItem(props: Props): JSX.Element {
  const { menu, handleMenuClick } = props;
  const { activeMenu, setActiveMenu } = appPagesStore;
  const [close, setClose] = useState<boolean>(false);

  function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>, menu: Menu): void {
    e.stopPropagation();
    if (menu.menuType !== MenuType.group) {
      setActiveMenu(menu);
    }
    if (menu?.menuType === MenuType.group) {
      const target = getLITarget(e.target as HTMLElement) as HTMLElement;
      if (close) {
        css(target, {
          height: 'auto',
        });
      } else {
        css(target, {
          height: '36px',
          overflow: 'hidden',
        });
      }
      setClose(!close);
    }
  }

  const isActive = activeMenu.id === menu.id && !menu.child?.length;

  return (
    <li
      key={menu?.id}
      data-id={menu?.id}
      data-type={menu.menuType}
      className={cs('menu-item-submenu-header', { 'bg-white': isActive })}
    >
      <div
        draggable
        className={cs('h-36 menu-item ', {
          'menu-item--active': isActive,
        })}
        onDragEnd={() => setClose(false)}
        onClick={(e) => handleClick(e, menu)}
      >
        <MenuLabel menu={menu} activeMenu={activeMenu} isClose={close} />
        <span className={`${menu.id === activeMenu.id ? 'block' : 'menu-item--operate'}`}>
          <MenuOp menu={menu} handleMenuClick={handleMenuClick} />
        </span>
      </div>
      <NestMenu {...props} />
    </li >
  );
}

export default observer(MenuItem);

import React from 'react';
import { observer } from 'mobx-react';
import { has, isEmpty } from 'lodash';
import { toJS } from 'mobx';
import cs from 'classnames';

import toast from '@lib/toast';

import appPagesStore from '../../store';
import { movePage } from '../../api';
import { MenuType } from '../../type';
import MenuTree from './menu-tree';
import MenuOp from './menu-op';
import MenuLabel from './menu-label';
import { animation, clearTranslate, collapse, insertBefore, willNest } from './utils';

import './index.scss';

type Props = {
  menu: Menu;
  className?: string;
  handleMenuClick?: (key: string, treeItem: Menu) => void;
}

function MenuItem({ menu, handleMenuClick }: Props): JSX.Element {
  const { activeMenu, lastHover, pageInitList, setActiveMenu, update, setLastHover } = appPagesStore;

  function handleDragStart(e: React.DragEvent, menu: Menu): void {
    e.stopPropagation();
    setActiveMenu(menu);
    update(collapse(menu, pageInitList, true));
  }

  function updateMoveData(): void {
    if (willNest(activeMenu, lastHover)) {
      return;
    }
    const dto = {
      id: activeMenu.id as string,
      Name: activeMenu.name as string,
      appID: activeMenu.appID as string,
      fromSort: (activeMenu.sort || 0),
      toSort: (lastHover.sort || 0) + 1,
      fromGroupID: activeMenu.groupID as string,
      toGroupID: lastHover.groupID as string,
    };
    movePage(dto).catch((err) => {
      toast.error('移动页面位置失败:', err.data.msg);
    });
  }

  function handleDragOver(e: React.DragEvent, menu: Menu): void {
    e.preventDefault();
    e.stopPropagation();
    setLastHover(menu);
    update(animation(menu, pageInitList));
    const el = document?.querySelector(`[data-id='${activeMenu.id}']`) as any;
    if (el) {
      el.classList.add('hidden');
    }

    if (menu.menuType === MenuType.group) {
      const _pageInitList = pageInitList.map((item: Menu) => {
        if (item.id === menu.id) {
          (item?.child || []).forEach((ch: Menu) => ch['open'] = true);
        }
        return item;
      });
      update(_pageInitList);
    }
  }

  function handleDragEnd(e: React.DragEvent): void {
    e.stopPropagation();
    e.preventDefault();
    update(clearTranslate(insertBefore(activeMenu, lastHover, pageInitList)));
    const el = document?.querySelector(`[data-id='${activeMenu.id}']`) as any;
    if (el) {
      el.classList.remove('hidden');
    }
    updateMoveData();
  }

  function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>, menu: Menu): void {
    e.stopPropagation();

    if (menu?.child) {
      update(collapse(menu, pageInitList));
    } else {
      setActiveMenu(menu);
    }
  }

  const style: React.CSSProperties = {
    transition: 'transform 0.2s cubic-bezier(0.2, 0, 0, 1)',
  };
  if (menu?.translate) {
    style.transform = `translateY(${menu?.translate || 0})`;
  }

  function getMenuList(menus: Menu[]): Menu[] {
    return menus
      .sort((a, b) => ((a.sort || 0) - (b?.sort || 0)))
      .filter((item: Menu) => (menu.child?.length && (!has(item, 'open') || item.open))) ?? [];
  }

  const isActive = activeMenu.id === menu.id && !menu.child?.length;

  return (
    <li
      key={menu?.id}
      data-id={menu?.id}
      style={style}
      className={cs({ 'bg-white': isActive })}
    >
      <div
        draggable
        className={cs('h-40 menu-item', {
          'menu-item-active': isActive,
          'menu-item-indent': menu?.groupID,
        })}
        onClick={(e) => handleClick(e, menu)}
        onDragStart={(e) => handleDragStart(e, menu)}
        onDragOver={(e) => handleDragOver(e, menu)}
        onDragEnd={(e) => handleDragEnd(e)}
      >
        <MenuLabel menu={menu} activeMenu={activeMenu} />
        <span className='menu-op'>
          <MenuOp menu={menu} handleMenuClick={handleMenuClick} />
        </span>
      </div >
      {
        !isEmpty(menu?.child) &&
        (<MenuTree
          handleMenuClick={handleMenuClick}
          menus={getMenuList(toJS(menu?.child) as Menu[])}
        />)
      }
    </li >
  );
}

export default observer(MenuItem);

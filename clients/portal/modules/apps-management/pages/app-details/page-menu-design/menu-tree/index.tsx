import React, { useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';

import toast from '@lib/toast';

import appPagesStore from '@portal/modules/apps-management/pages/app-details/store';
import { MenuType } from '@portal/modules/apps-management/pages/app-details/type';
import { movePage } from '@portal/modules/apps-management/pages/app-details/api';
import MenuTree from './menu-tree';
import {
  animate,
  css,
  flatMnues,
  getAttribute,
  getEleIndex,
  getLastChild,
  getLITarget,
} from './utils';
import { Menu } from './type';

function isNest(draggingMenu: Menu, lastMenu: Menu): boolean {
  if (!draggingMenu || !lastMenu) {
    return true;
  }
  return draggingMenu?.menuType === MenuType.group && !!lastMenu?.groupID;
}

type Props = {
  menus: Menu[];
  handleMenuClick: (key: string, menu: Menu) => void;
}

const AppMenuTree = (props: Props): JSX.Element => {
  const targetIdxsRef = useRef<number>(-1);
  const dragingIdxsRef = useRef<number>(-1);

  const [draggingMenu, setDraggingMenu] = useState<Menu | null>();
  const [lastMenu, setLastMenu] = useState<Menu | null>();

  const { pageInitList, draggingNode, setDraggingNode, setActiveMenu } = appPagesStore;
  const menusRef = useRef<Record<string, Menu>>();
  menusRef.current = flatMnues(toJS(pageInitList));

  function handleDragStart(e: React.DragEvent<HTMLElement>): void {
    e.stopPropagation();
    const target = getLITarget(e.target as HTMLElement) as HTMLElement;
    const id = getAttribute(target, 'data-id');
    const menus = menusRef.current || {};
    setActiveMenu(menus[id]);
    setDraggingNode(target);
    setDraggingMenu(menus[id]);
    requestAnimationFrame(() => {
      css(target, {
        visibility: 'hidden',
      });
    });
    css(target, {
      height: '36px',
      oveflow: 'hidden',
      cursor: 'move',
    });
    dragingIdxsRef.current = getEleIndex(target);
  }

  function handleDragOver(e: React.DragEvent<HTMLElement>): void {
    e.preventDefault();
    e.stopPropagation();
    const target = getLITarget(e.target as HTMLElement);
    if ((e.target as any)?.tagName === 'UL') {
      return;
    } // for prevent flashing when dragging over submenu
    const id = getAttribute(target, 'data-id');
    const menus = menusRef.current || {};
    if (Number(getAttribute(target, 'data-type')) === MenuType.group && id !== draggingMenu?.id) {
      if (target && !target?.lastElementChild?.childElementCount && draggingMenu?.menuType !== MenuType.group) {
        css(target, {
          height: 'auto',
        });
        getLastChild(target)?.insertBefore(draggingNode, null);
        setLastMenu({
          ...menus[id],
          groupID: id,
        });
      }
    }
    // stop next animation before current snapshot finish animation
    if ((target as any)?.animated) {
      return;
    }
    if (!draggingNode || !target) {
      return;
    }
    if (target === draggingNode) {
      return;
    }
    setLastMenu(menus[id]);

    // get target postion before move
    const targetRect = target.getBoundingClientRect();
    const dragingRect = draggingNode.getBoundingClientRect();
    // change position
    targetIdxsRef.current = getEleIndex(target);
    if (draggingMenu && id && !isNest(draggingMenu, menus[id])) {
      if (getEleIndex(draggingNode) < getEleIndex(target)) {
        target?.parentNode?.insertBefore(draggingNode, target.nextSibling);
      } else {
        target?.parentNode?.insertBefore(draggingNode, target);
      }
      animate(dragingRect, draggingNode, 300);
      animate(targetRect, target, 300);
    }
  }

  function handleDragEnd(e: React.DragEvent<HTMLElement>): void {
    e.stopPropagation();
    e.preventDefault();
    const flatMenu = menusRef.current;

    css(draggingNode, {
      height: 'auto',
      border: 'none',
    });
    if (flatMenu && draggingMenu) {
      const id = draggingMenu.id;
      flatMenu[id].groupID = lastMenu?.groupID;
    }
    // commit update request
    if (draggingMenu && lastMenu && !isNest(draggingMenu as Menu, lastMenu as Menu)) {
      submitPositionInfo(draggingMenu, lastMenu);
    }
    css(draggingNode, {
      visibility: 'visible',
    });
    // reset ref
    dragingIdxsRef.current = -1;
    targetIdxsRef.current = -1;
  }

  // sync position info to server
  function submitPositionInfo(activeMenu: Menu, lastMenu: Menu): void {
    const dto = {
      id: activeMenu.id as string,
      Name: activeMenu.name as string,
      appID: activeMenu.appID as string,
      fromSort: (dragingIdxsRef.current || 0) + 1,
      toSort: lastMenu.menuType === MenuType.group ? 1 : (targetIdxsRef.current || 0) + 1,
      fromGroupID: activeMenu.groupID as string,
      toGroupID: lastMenu.groupID as string,
    };

    movePage(dto).catch((err) => {
      toast.error('移动页面位置失败:', err.data.msg);
    });
  }

  return (
    <div
      className='menu-tree'
      onDragStart={(e) => handleDragStart(e)}
      onDragOver={(e) => handleDragOver(e)}
      onDragEnd={(e) => handleDragEnd(e)}
    >
      <MenuTree {...props} />
    </div>
  );
};

export default observer(AppMenuTree);

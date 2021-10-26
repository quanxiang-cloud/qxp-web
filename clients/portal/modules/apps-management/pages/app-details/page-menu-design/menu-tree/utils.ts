import { cloneDeep } from 'lodash';

export function willNest(from: Menu, to: Menu): boolean {
  return !!((from?.child?.length || 0) > 0 && to?.groupID);
}

/**
 * pageInitList mutation
 * @param {Menu} activeMenu dragArea data
 * @param {Menu} hoverMenu dropArea data
 * @param {Menu[]} pageInitList store list
 * @return {Menu[]} list
 */
export const insertBefore = (activeMenu: Menu, hoverMenu: Menu, pageInitList: Menu[]): Menu[] => {
  if (willNest(activeMenu, hoverMenu)) {
    return pageInitList;
  }

  let _pageInitList = cloneDeep(pageInitList);
  const hoverSort = hoverMenu.sort || 0;

  // pageInitList activeMenu menu
  if (!activeMenu.groupID && !hoverMenu.groupID) {
    _pageInitList = cloneDeep(pageInitList).map((item: Menu) => {
      if ((item.sort || 0) >= (hoverMenu.sort || 0)) {
        item.sort = (item.sort || 0) + 1;
      }

      if (item.id === activeMenu.id) {
        item.sort = hoverSort;
      }
      return item;
    });
  }

  if (activeMenu.groupID && !hoverMenu.groupID) {
    const _child = pageInitList.find((item: Menu) => item.id === activeMenu.groupID)?.child;
    const filteredChild = _child?.filter((item: Menu) => item.id !== activeMenu.id);
    _pageInitList = pageInitList.map((item: Menu) => {
      if (item.id === activeMenu.groupID) {
        item.child = filteredChild;
      }
      if ((item.sort || 0) >= (hoverMenu.sort || 0)) {
        item.sort = (item.sort || 0) + 1;
      }
      return item;
    });
    const insertIndex = _pageInitList.findIndex((item) => item.id === hoverMenu.id);
    _pageInitList.splice(insertIndex, 0, { ...activeMenu, sort: hoverSort, groupID: '' });
  }

  if (!activeMenu.groupID && hoverMenu.groupID) {
    _pageInitList = pageInitList.filter((item) => item.id !== activeMenu.id);
    const _child = pageInitList.find((item) => item.id === hoverMenu.groupID)?.child || [];
    _child.forEach((item) => {
      if ((item.sort || 0) >= hoverSort) {
        item.sort = (item.sort || 0) + 1;
      }
    });

    const insertIndex = _child.findIndex((item) => item.id === hoverMenu.id);
    _child.splice(insertIndex, 0, { ...activeMenu, sort: hoverSort, groupID: hoverMenu.groupID });
    _pageInitList = _pageInitList.map((item: Menu) => {
      if (item.id === hoverMenu.groupID) {
        item.child = _child;
      }
      return item;
    });
  }

  if (activeMenu.groupID && hoverMenu.groupID) {
    const _dragChild = pageInitList
      .find((item) => item.id === activeMenu.groupID)?.child?.filter((item) => item.id !== activeMenu.id);
    const _activeMenu = Object.assign({}, { ...activeMenu }, { groupID: hoverMenu.groupID, sort: hoverSort });

    let _hoverChild = pageInitList
      .find((item) => item.id === hoverMenu.groupID)?.child || [];
    if (activeMenu.groupID === hoverMenu.groupID) {
      _hoverChild = _hoverChild.filter((item) => item.id !== activeMenu.id);
    }
    _hoverChild = _hoverChild.map((item: Menu) => {
      if ((item.sort || 0) >= hoverSort) {
        item.sort = (item.sort || 0) + 1;
      }

      return item;
    });

    const insertIndex = _hoverChild.findIndex((item) => item.id === hoverMenu.id);
    _hoverChild.splice(insertIndex, 0, _activeMenu);
    _pageInitList = _pageInitList.map((item) => {
      if (activeMenu.groupID !== hoverMenu.groupID) {
        if (item.id === activeMenu.groupID) {
          item.child = _dragChild;
        }
      }
      if (item.id === hoverMenu.groupID) {
        item.child = _hoverChild;
      }
      return item;
    });
  }

  return _pageInitList;
};

/**
 * close menu when dragging group
 * @param {Menu} menu
 * @param {Menu} pageInitList
 * @param {boolean?} keepClose
 * @return {Menu[]}
 */
export const collapse = (menu: Menu, pageInitList: Menu[], keepClose?: boolean): Menu[] => {
  if (menu.child?.length) {
    const open = menu.child.some((item: Menu) => item?.open);
    const _child = menu.child.map((item: Menu) => {
      item['open'] = keepClose ? false : !open;
      return item;
    });
    const _pageInitList = pageInitList.map((item: Menu) => {
      if (item.id === menu.id) {
        item.child = _child;
        item['icon'] = open ? 'arrow_drop_down' : 'arrow_drop_up';
      }
      return item;
    });

    return _pageInitList;
  }
  return pageInitList;
};

/**
 * clear animation property
 * @param {Menu[]} menus
 * @return {Menu[]}
 */
export const clearTranslate = (menus: Menu[]): Menu[] => {
  return menus.map((item: Menu) => {
    delete item['translate'];
    if (item.child?.length) {
      item.child = clearTranslate(item?.child as Menu[]);
    }
    return item;
  });
};

/**
 * Add dragging animation
 * @param {Menu} menu
 * @param {Menu[]}pageInitList
 * @return {Menu[]}
 */
export const animation = (menu: Menu, pageInitList: Menu[]): Menu[] => {
  const currentHoverSort = menu.sort || 0;
  let _pageInitList: Menu[] = clearTranslate(pageInitList);
  if (!menu.groupID) {
    _pageInitList = _pageInitList.map((item: Menu) => {
      if ((item.sort || 0) >= currentHoverSort) {
        item['translate'] = '40px';
      }
      return item;
    });
  }
  // drag to inner
  if (menu.groupID) {
    const { sort, child = [] } = pageInitList.find((item) => item.id === menu.groupID) as Menu;
    const _child = child?.map((item: Menu) => {
      if ((item.sort || 0) >= currentHoverSort) {
        item['translate'] = '40px';
      }
      return item;
    });

    _pageInitList = _pageInitList.map((item: Menu) => {
      if (((item.sort || 0) || 0) > (sort || 0)) {
        item['translate'] = '40px';
      }
      if (item.id === menu.groupID) {
        item.child = _child;
      }
      return item;
    });
  }

  return _pageInitList;
};

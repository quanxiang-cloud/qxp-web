import { NodeItem } from './index';

export function pageListToTree(list: PageInfo[], parentID?: string): NodeItem<PageInfo>[] {
  return list.map((menu) => {
    return {
      title: menu.name || '',
      type: menu.menuType === 1 ? 'group' : 'leaf',
      id: menu.id,
      iconName: menu.icon || '',
      children: menu.child ? pageListToTree(menu.child, menu.id) : undefined,
      source: menu,
      parentID,
    };
  });
}

export function treeFind<T>(menus: NodeItem<T>[], targetID: string): NodeItem<T> | null {
  for (const menu of menus) {
    if (targetID === menu.id) {
      return menu;
    }

    if (menu.children) {
      const res = treeFind(menu.children, targetID);
      if (res) return res;
    }
  }

  return null;
}

export function findFirstLeafNode<T>(menus: NodeItem<T>[]): NodeItem<T> | undefined {
  for (const menu of menus) {
    if (menu.type === 'leaf') {
      return menu;
    }

    if (menu.children && menu.children.length) {
      const firstPage = findFirstLeafNode(menu.children);
      if (firstPage) {
        return firstPage;
      }
    }
  }
}

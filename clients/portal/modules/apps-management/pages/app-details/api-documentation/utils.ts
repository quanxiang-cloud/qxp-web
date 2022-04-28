import { DirectoryChild, Directory, APIData } from '@lib/api-collection';
import { isApi } from '@lib/api-collection/utils';
import { NodeItem } from '@c/two-level-menu';

type DirectoryRule = {
  name: string;
  deep: number;
  leafIsApi: boolean;
  order: number;
};

const directoryRule: DirectoryRule[] = [
  { name: 'form', deep: 1, leafIsApi: false, order: 0 },
  { name: 'customer', deep: 2, leafIsApi: true, order: 1 },
  { name: 'faas', deep: 2, leafIsApi: true, order: 2 },
  { name: 'poly', deep: 2, leafIsApi: true, order: 3 },
];

export const createMenus = (directoryChildren: DirectoryChild[], isRoot?: boolean): NodeItem<DirectoryChild>[] => {
  return directoryChildren.reduce((menus: NodeItem<DirectoryChild>[], directoryChild) => {
    if (directoryChild.active === 0) return menus;

    if (isApi(directoryChild)) {
      const { id, name, title } = directoryChild;
      menus.push({
        root: false,
        disableSelect: false,
        id,
        title: title || name,
        type: 'leaf',
        source: directoryChild,
        leafIsApi: false,
        iconName: 'api',
      });
      return menus;
    }

    const _isLeaf = isLeaf(directoryChild);
    const _isRootDirectory = isRootDirectory(directoryChild);

    if (!_isRootDirectory && isRoot) {
      menus.push(...createMenus(directoryChild.children || [], true));
    } else {
      const { id, name, title, children } = directoryChild;
      menus.push({
        root: !!isRoot,
        disableSelect: !!isRoot,
        id,
        title: title || name,
        tableID: name,
        type: _isLeaf ? 'leaf' : 'group',
        source: directoryChild,
        leafIsApi: leafIsApi(directoryChild),
        children: _isLeaf ? undefined : createMenus(children || []),
      });
    }
    return menus;
  }, []);
};

export const filterMenusByKeyWord = (menus: NodeItem<DirectoryChild>[], keyWord: string): NodeItem<DirectoryChild>[] => {
  if (!keyWord) return menus;

  return menus.filter((menu) => {
    if (menu.title.match(keyWord)) return true;
    if (!menu.children) return false;

    const curMenuChildren = filterMenusByKeyWord(menu.children, keyWord);
    menu.children = curMenuChildren;

    return !!curMenuChildren.length;
  });
};

export const sortMenusByOrder = (menus: NodeItem<DirectoryChild>[]): NodeItem<DirectoryChild>[] => {
  return menus.sort((beforeMenu, curMenu) => {
    const beforeMenuRule = findRuleByName(beforeMenu.tableID);
    const curMenuRule = findRuleByName(curMenu.tableID);
    return (beforeMenuRule?.order || 0) - (curMenuRule?.order || 0);
  });
};

export const concatApiDataList = (apiDataList: APIData[]): DirectoryChild[] => {
  return apiDataList.reduce((directoryChildren: DirectoryChild[], apiData) => {
    if (!apiData.directory.children) return directoryChildren;
    if (apiData.directory.name === 'poly') {
      return [...directoryChildren, { ...apiData.directory, title: '编排API', active: 1 }];
    }
    return [...directoryChildren, ...apiData.directory.children];
  }, []);
};

const isRootDirectory = (directoryChild: Directory): boolean => {
  return directoryRule.some(({ name }) => {
    return directoryChild.name === name;
  });
};

const leafIsApi = (directoryChild: Directory): boolean => {
  const curDirectoryRule = directoryRule.find(({ name, deep }) => {
    const splitPath = directoryChild.parent.split('/');
    return splitPath[splitPath.length - deep + 1] === name;
  });
  return !!curDirectoryRule?.leafIsApi;
};

const isLeaf = (directoryChild: Directory): boolean => {
  return directoryRule.some(({ name, deep }) => {
    const splitPath = directoryChild.parent.split('/');
    return splitPath[splitPath.length - deep] === name;
  });
};

const findRuleByName = (name: string): DirectoryRule | undefined => {
  return directoryRule.find((rule) => rule.name === name);
};

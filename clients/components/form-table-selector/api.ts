import { QueryFunctionContext } from 'react-query';

import httpClient from '@lib/http-client';

interface MenuListItem {
  id: string;
  name: string;
  groupID: string;
  child: MenuListItem[];
}

type Option = {
  label: string;
  value: string;
  children?: Option[];
};

export type Options = Option[];

export async function getFormDataOptions({ queryKey }: QueryFunctionContext): Promise<Options> {
  const data = await httpClient<{
      menu: MenuListItem[],
  }>(`/api/v1/structor/${queryKey[1]}/${window.SIDE === 'portal' ? 'm' : 'home'}/menu/list`, {
    appID: queryKey[1],
  });
  function parseMenuList(menuList: MenuListItem[]) {
    if (!menuList) {
      return [];
    }
    return menuList.reduce((prev: Options, current) => {
      prev.push({
        label: current.name,
        value: current.id,
        children: [
          ...parseMenuList(current.child),
        ],
      });
      return prev;
    }, []);
  }

  return parseMenuList(data.menu);
}

export async function getFormListOptions({ queryKey }: QueryFunctionContext): Promise<Options> {
  const menus = await httpClient<{ menu: MenuListItem[] }>(
    `/api/v1/structor/${queryKey[1]}/${window.SIDE === 'portal' ? 'm' : 'home'}/menu/list`,
    { appID: queryKey[1] }
  );

  function parseMenuList(menuList: MenuListItem[]) {
    if (!menuList) {
      return [];
    }

    const list = menuList.filter((form) => !form.child);
    menuList.filter((form) => form.child).forEach((form) => {
      form.child.forEach((item) => list.push(item));
    });

    return list.reduce((prev: Options, current) => {
      prev.push({
        label: current.name,
        value: current.id,
        children: [
          ...parseMenuList(current.child),
        ],
      });
      return prev;
    }, []);
  }

  return parseMenuList(menus.menu);
}

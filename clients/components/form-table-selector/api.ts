import httpClient from '@lib/http-client';

export type MenuListItem = {
  id: string;
  name: string;
  groupID: string;
  menuType: 0 | 1;
  child: MenuListItem[];
}

type MenuListPageItem = {
  id: string;
  name: string;
}

export type Option = {
  label: string;
  value: string;
  isGroup: boolean;
  children?: Option[];
};

export async function getFormDataOptions(appID: string): Promise<Option[]> {
  const { menu } = await httpClient(
    `/api/v1/structor/${appID}/${window.SIDE === 'portal' ? 'm' : 'home'}/menu/list`,
    { appID });
  return parseMenuListWithOptions(menu ? menu : []);
}

export async function getFormDataMenuList(appID: string): Promise<LabelValue[]> {
  const { pages } = await httpClient(`/api/v1/structor/${appID}/m/menu/listPage`, { appID });
  return pages ? pages.map(({ id, name }: MenuListPageItem) => ({ label: name, value: id })) : [];
}

function parseMenuListWithOptions(menuList: MenuListItem[]): Option[] {
  return menuList?.reduce((prev: Option[], current) => {
    prev.push({
      label: current.name,
      value: current.id,
      isGroup: current.menuType === 1,
      children: [...parseMenuListWithOptions(current.child)],
    });
    return prev;
  }, []);
}

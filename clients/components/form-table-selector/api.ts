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

export async function getFormDataMenuList(appID: string): Promise<LabelValue[]> {
  const { page } = await httpClient(`/api/v1/form/${appID}/m/table/search`);
  return page ? page.map(({ id, name }: MenuListPageItem) => ({ label: name, value: id })) : [];
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

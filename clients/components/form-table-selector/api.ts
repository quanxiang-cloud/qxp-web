import httpClient from '@lib/http-client';

export type MenuListItem = {
  id: string;
  name: string;
  groupID: string;
  menuType: 0 | 1;
  child: MenuListItem[];
}

export type Option = {
  label: string;
  value: string;
  isGroup: boolean;
  children?: Option[];
};

export async function getFormDataMenuList(appID: string): Promise<LabelValue[]> {
  const { list } = await httpClient(`/api/v1/form/${appID}/m/table/search`);
  return list ? list.map(({ tableID, title }: DataModel) => ({ label: title, value: tableID })) : [];
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

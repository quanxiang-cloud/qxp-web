import { MenuType } from '@portal/modules/apps-management/pages/app-details/type';

import { FetchPageListResponse, Menu } from './types';

export function mapColor(color?: BgColor): string {
  switch (color) {
  case 'amber':
    return '#f59e0b';
  case 'orange':
    return '#f97316';
  case 'indigo':
    return '#6366f1';
  case 'teal':
    return '#14b8a6';
  case 'fuchsia':
    return '#d946ef';
  case 'emerald':
    return '#10b981';
  case 'cyan':
    return '#06b6d4';
  case 'red':
    return '#ef4444';
  }
  return color ?? '#f59e0b';
}

export function menuIsMobilePage(type: MenuType): boolean {
  return [MenuType.schemaForm, MenuType.customPage].includes(type);
}

export function mapMenu(res?: FetchPageListResponse): Menu[] {
  const treeMenu = res?.menu?.filter(({ isHide }: Menu) => !isHide);
  const menuMapped: Menu[] = [];
  treeMenu?.forEach((m) => {
    if (menuIsMobilePage(m.menuType)) {
      menuMapped.push(m);
    } else if (m.child && m.child.length) {
      m.child.forEach((child) => {
        if (menuIsMobilePage(child.menuType)) {
          menuMapped.push({
            ...child,
            sort: m.sort + (child.sort * 0.01),
          });
        }
      });
    }
  });
  return menuMapped;
}

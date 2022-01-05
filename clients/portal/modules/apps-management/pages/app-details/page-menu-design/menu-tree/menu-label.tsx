import React from 'react';
import classNames from 'classnames';

import Icon from '@c/icon';

import { MenuType } from '@portal/modules/apps-management/pages/app-details/type';
import { Menu } from './type';
import './index.scss';

type Props = {
  activeMenu: Menu;
  menu: Menu;
  isClose?: boolean;
}

const MenuLabel = ({ activeMenu, menu, isClose }: Props): JSX.Element => {
  const cls = classNames('items-center flex', {
    'text-gray-900': activeMenu.id === menu.id,
  });

  function getGroupIcon(menu: Menu, isClose: boolean): string {
    if (menu.menuType === MenuType.group) {
      return isClose ? 'folder_empty' : 'folder_open';
    }
    return menu?.icon || 'folder_empty';
  }
  return (
    <span className={cls}>
      <Icon className='mr-4 text-current' size={16} name={getGroupIcon(menu, !!isClose)} />
      <span title={menu.name} className='truncate menu-item--title text-12'>{menu?.name}</span>
      {menu?.isHide && <Icon className='mr-4 ml-4' size={16} name='visibility_off' />}
    </span>
  );
};

export default MenuLabel;

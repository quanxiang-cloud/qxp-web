import React from 'react';
import classNames from 'classnames';

import Icon from '@c/icon';

import './index.scss';
import { has } from 'lodash';

type Props = {
  activeMenu: Menu;
  menu: Menu;
}

function getGroupIcon(menu: Menu): string {
  const isOpen = menu.child?.some((item: Menu) => !has(item, 'open') || (has(item, 'open') && item?.open));

  if (menu.child) {
    return isOpen ? 'folder_open' : 'folder_empty';
  }

  return menu?.icon || 'folder_empty';
}

const MenuLabel = ({ activeMenu, menu }: Props): JSX.Element => {
  const cls = classNames('items-center flex', {
    'text-gray-900': activeMenu.id === menu.id,
  });

  return (
    <span className={cls}>
      <Icon className='mr-4 text-current' size={16} name={getGroupIcon(menu)} />
      <span title={menu.name} className='truncate menu-item--title text-12'>{menu?.name}</span>
      {menu?.isHide && <Icon className='mr-4 ml-4' size={16} name='visibility_off' />}
    </span>
  );
};

export default MenuLabel;

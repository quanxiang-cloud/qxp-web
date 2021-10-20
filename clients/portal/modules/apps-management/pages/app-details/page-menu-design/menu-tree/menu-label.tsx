import React from 'react';
import classNames from 'classnames';

import Icon from '@c/icon';

import './index.scss';

type Props = {
  activeMenu: Menu;
  menu: Menu;
}

const MenuLabel = ({ activeMenu, menu }: Props): JSX.Element => {
  const cls = classNames('items-center flex', {
    'text-blue-600': activeMenu.id === menu.id,
  });

  return (
    <span className={cls}>
      <Icon className='mr-4' size={20} name={menu?.icon || 'arrow_drop_up'} />
      <span title={menu.name} className='truncate item-title'>{menu?.name}</span>
      {menu?.isHide && <Icon className='mr-4 ml-4' size={20} name='visibility_off' />}
    </span>
  );
};

export default MenuLabel;

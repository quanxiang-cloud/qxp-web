import React from 'react';

import MenuItem from './menu-item';
import { Menu } from './type';
import './index.scss';

type Props = {
  menus: Menu[];
  className?: string;
  onOpClick?: (menu: Menu) => void;
  handleMenuClick?: (key: string, treeItem: Menu) => void;
}

function MenuTree({
  menus = [],
  className,
  ...rest
}: Props): JSX.Element {
  return (
    <ul className={className}>
      {menus.map(
        (menu: Menu) => (
          <MenuItem
            {...rest}
            key={menu.id}
            menu={menu}
          />
        ),
      )}
    </ul >
  );
}

export default MenuTree;

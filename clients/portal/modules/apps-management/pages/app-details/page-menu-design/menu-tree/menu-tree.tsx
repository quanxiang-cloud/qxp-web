import React from 'react';

import MenuItem from './menu-item';
import './index.scss';

type Props = {
  menus: Menu[];
  onOpClick?: (menu: Menu) => void;
  handleMenuClick?: (key: string, treeItem: Menu) => void;
}

function MenuTree({
  menus = [],
  ...rest
}: Props): JSX.Element {
  return (
    <ul
      className='menu-tree'
      onDragOver={(e) => e.preventDefault()}
    >
      {
        menus.map(
          (menu: Menu) => (
            <MenuItem
              {...rest}
              key={menu.id}
              menu={menu}
            />
          ),
        )
      }
    </ul >
  );
}

export default MenuTree;

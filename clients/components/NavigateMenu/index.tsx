import React, { useState } from 'react';
import cs from 'classnames';

import MenuItem, { MenuItemType } from './menu-item';

type Props = {
  menus: Array<MenuItemType>;
  goLink: (path: string) => void;
  mode?: 'top' | 'side';
  showExpandIcon?: boolean;
  className?: string;
  itemClassName?: string;
  activeClassName?: string;
  itemHoverClassName?: string;
  style?: Record<string, string>;
  itemStyle?: Record<string, string>;
}

function NavigationMenu({
  menus,
  mode,
  style,
  itemStyle,
  className,
  itemClassName,
  showExpandIcon,
  itemHoverClassName = 'menu-item-hover',
  activeClassName = 'active-menu-item',
  goLink,
}: Props): JSX.Element {
  const [activeItemId, setActiveItemId] = useState<string>('');

  return (
    <div
      className={cs('bg-white', { flex: mode === 'top' }, className)}
      style={style}
    >
      {menus.map((menu) => (
        <MenuItem
          menu={menu}
          key={menu.id}
          level={1}
          maxLevel={2}
          mode={mode}
          className={cs('bg-white', itemClassName)}
          style={itemStyle}
          onSelectItem={setActiveItemId}
          goLink={goLink}
          activeId={activeItemId}
          showExpandIcon={showExpandIcon}
          itemHoverClassName={itemHoverClassName}
          activeClassName={activeClassName}
        />
      ))}
    </div>
  );
}

export default NavigationMenu;

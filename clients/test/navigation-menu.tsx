import React, { useState } from 'react';
import cs from 'classnames';

import MenuItem, { MenuItemType } from './menu-item';

type Props = {
  menus: Array<MenuItemType>;
  mode?: 'top' | 'side';
  className?: string;
  itemClassName?: string;
  style?: Record<string, string>;
  itemStyle?: Record<string, string>;
  showExpandIcon?: boolean;
}

function NavigationMenu({
  menus,
  mode,
  style,
  itemStyle,
  className,
  itemClassName,
  showExpandIcon,
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
          activeId={activeItemId}
          showExpandIcon={showExpandIcon}
        />
      ))}
    </div>
  );
}

export default NavigationMenu;

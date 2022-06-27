import React, { useState } from 'react';
import cs from 'classnames';
import { omit } from 'lodash';

import MenuItem, { MenuItemType } from './menu-item';

type Props = {
  menus: Array<MenuItemType>;
  goLink: (path: string) => void;
  onSelectedItem?: (itemId: string) => void;
  mode?: 'top' | 'side';
  showExpandIcon?: boolean;
  iconSize?: number;
  activeId?: string;
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
  activeId,
  iconSize,
  itemStyle,
  className,
  itemClassName,
  showExpandIcon,
  itemHoverClassName = 'menu-item-hover',
  activeClassName = 'menu-item-active',
  onSelectedItem,
  goLink,
}: Props): JSX.Element {
  const [activeItemId, setActiveItemId] = useState<string>(activeId ?? '');

  function handleSelectItem(itemId: string): void {
    onSelectedItem && onSelectedItem(itemId);
    setActiveItemId(itemId);
  }

  return (
    <div
      className={cs(
        `bg-white overflow-auto ${mode === 'top' ? 'flex items-center h-full' : 'w-full'}`,
        className,
      )}
      style={style}
    >
      {menus.map((menu) => (
        <MenuItem
          menu={menu}
          key={menu.id}
          level={1}
          maxLevel={2}
          mode={mode}
          iconSize={iconSize}
          className={itemClassName}
          style={itemStyle}
          onSelectItem={handleSelectItem}
          goLink={goLink}
          activeId={activeItemId}
          showExpandIcon={showExpandIcon}
          itemHoverClassName={!itemHoverClassName ? 'menu-item-hover' : itemHoverClassName}
          activeClassName={!activeClassName ? 'menu-item-active' : activeClassName}
          popperStyle={{ ...omit(style, 'height', 'width') }}
        />
      ))}
    </div>
  );
}

export default NavigationMenu;

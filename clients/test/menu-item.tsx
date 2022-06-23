import React, { useState, useEffect, useRef } from 'react';
import cs from 'classnames';

import usePopper from '@c/popper2';

import Icon from '@c/icon';

import './index.scss';

export type MenuItemType = {
  id: string;
  title: string;
  icon?: string;
  externalLink?: string;
  innerPath?: string;
  children?: Array<MenuItemType>;
}

type Props = {
  menu: MenuItemType;
  level?: number;
  maxLevel?: number;
  itemHeight?: number;
  activeId?: string;
  mode?: 'top' | 'side';
  className?: string;
  activeClassName?: string;
  itemHoverClassName?: string;
  style?: Record<string, string>;
  onSelectItem?: (item: any) => void;
  showExpandIcon?: boolean;
}

export default function MenuItem({
  menu,
  level = 1,
  maxLevel = 3,
  itemHeight = 30,
  activeId,
  mode = 'side',
  className,
  style,
  activeClassName,
  itemHoverClassName,
  showExpandIcon = true,
  onSelectItem,
}: Props): JSX.Element | null {
  const { id, title, icon, children, externalLink, innerPath } = menu;
  const nodeRef = useRef<HTMLDivElement>(null);
  const currentChildrenHeight = useRef<number>();
  const [expand, setExpand] = useState(false);
  const { handleClick: changeShowPopper, referenceRef, Popper } = usePopper<HTMLDivElement>();

  useEffect(() => {
    if (nodeRef.current && children) {
      currentChildrenHeight.current = nodeRef.current.children.length * itemHeight;
    }
  }, []);

  function getSubMenuItemsHeight(): number {
    return expand && children && currentChildrenHeight.current ? currentChildrenHeight.current : 0;
  }

  function changeExpand(): void {
    if (mode === 'top') return;
    if (!children) return setExpand(true);
    setExpand((prevExpand) => !prevExpand);
  }

  function handleItemClick(): void {
    changeExpand();
    !children && onSelectItem && onSelectItem(id);
    // !children && history.push('/apps/details');
  }

  function renderSubItems(item: MenuItemType) {
    return (
      <MenuItem
        menu={item}
        key={item.id}
        level={level + 1}
        maxLevel={maxLevel}
        className={cs('bg-white', className)}
        style={{ ...style }}
        onSelectItem={onSelectItem}
        activeId={activeId}
        showExpandIcon={showExpandIcon}
        itemHoverClassName={itemHoverClassName}
        activeClassName={activeClassName}
      />
    );
  }

  if (level > maxLevel) return null;

  return (
    <>
      <div
        ref={referenceRef}
        className="duration-300 text-12"
        onClick={mode === 'top' ? changeShowPopper() : undefined}
      >
        <div
          style={{ ...style, height: `${itemHeight}px` }}
          className={cs(
            `menu-item ${itemHoverClassName}`,
            { [`${activeClassName}`]: id === activeId },
            className,
          )}
          onClick={handleItemClick}
        >
          {icon && (<Icon name={icon} className="item-icon" size={children || level === 1 ? 24 : 20} />)}
          <span className={cs(`item-label px-${mode === 'side' && level > 1 ? 16 : 8}`)}>{title}</span>
          {children && showExpandIcon && (
            <Icon
              size={22}
              name="keyboard_arrow_down"
              className={cs(
                'flex-shrink-0 transform transition-transform duration-300',
                { 'rotate-180': expand },
              )}
            />
          )}
        </div>
        {mode === 'side' && (
          <div
            ref={nodeRef}
            style={{ height: getSubMenuItemsHeight() }}
            className={cs('menu-items-wrapper', { 'opacity-0 scale-y-0': !expand })}
          >
            {children?.map(renderSubItems)}
          </div>
        )}
      </div>
      <Popper placement='bottom-start'>
        <div>{children?.map(renderSubItems)}</div>
      </Popper>
    </>
  );
}

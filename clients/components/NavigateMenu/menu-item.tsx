import React, { useState, useEffect, useRef } from 'react';
import cs from 'classnames';

import usePopper from '@c/popper2';

import Icon from '@c/icon';

import './index.scss';

export type MenuItemType = {
  id: string;
  title: string;
  icon?: string;
  linkPath?: string;
  isExternal?: string;
  children?: Array<MenuItemType>;
}

function getItemHeight(height: string): number {
  if (!height) return 30;

  return parseInt(height.replace('px', ''));
}

type Props = {
  menu: MenuItemType;
  goLink: (path: string) => void;
  level?: number;
  maxLevel?: number;
  activeId?: string;
  mode?: 'top' | 'side';
  showExpandIcon?: boolean;
  iconSize?: number;
  className?: string;
  activeClassName?: string;
  itemHoverClassName?: string;
  style?: Record<string, string>;
  popperStyle?: Record<string, string>;
  onSelectItem?: (item: any) => void;
}

export default function MenuItem({
  menu,
  level = 1,
  maxLevel = 3,
  activeId,
  mode = 'side',
  className,
  iconSize,
  style,
  popperStyle,
  activeClassName,
  itemHoverClassName,
  showExpandIcon = true,
  onSelectItem,
  goLink,
}: Props): JSX.Element | null {
  const { id, title, icon, children, linkPath, isExternal } = menu;
  const nodeRef = useRef<HTMLDivElement>(null);
  const currentChildrenHeight = useRef<number>();
  const [expand, setExpand] = useState(false);
  const { handleClick: changeShowPopper, referenceRef, Popper } = usePopper<HTMLDivElement>();
  const itemHeight = getItemHeight(style?.height ?? '');

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
    if (children) return;

    onSelectItem && onSelectItem(id);
    if (!linkPath) return;

    if (isExternal) {
      window.open(linkPath);
      return;
    }

    return goLink && goLink(linkPath);
  }

  function renderSubItems(item: MenuItemType) {
    return (
      <MenuItem
        menu={item}
        key={item.id}
        level={level + 1}
        maxLevel={maxLevel}
        mode={mode}
        goLink={goLink}
        className={className}
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
        className="duration-300 text-12"
        onClick={mode === 'top' ? changeShowPopper() : undefined}
      >
        <div
          ref={referenceRef}
          style={{ ...style, height: `${itemHeight}px` }}
          className={cs(
            `menu-item ${itemHoverClassName}`,
            { [`${activeClassName}`]: id === activeId },
            className,
          )}
          onClick={handleItemClick}
        >
          {icon && (
            <Icon
              name={icon}
              className={cs('item-icon', { 'ml-16': level === 2 })}
              size={iconSize ?? (children || level === 1 ? 24 : 20)}
            />
          )}
          <span className={cs(`menu-item-label px-${mode === 'side' && level > 1 ? 16 : 8}`)}>{title}</span>
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
        <div className="bg-white" style={{ ...popperStyle }}>{children?.map(renderSubItems)}</div>
      </Popper>
    </>
  );
}

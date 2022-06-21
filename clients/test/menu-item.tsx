import React, { useState, useEffect, useRef } from 'react';
import cs from 'classnames';

import usePopper from '@c/popper2';

import Icon from '@c/icon';

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
}

export default function MenuItem({
  menu, level = 1, maxLevel = 3, itemHeight = 30, activeId, mode = 'side',
}: Props): JSX.Element | null {
  const { id, title, icon, children, externalLink, innerPath } = menu;
  const nodeRef = useRef<HTMLDivElement>(null);
  const currentChildrenHeight = useRef<number>();
  const [expand, setExpand] = useState(false);
  const { handleClick, referenceRef, Popper } = usePopper<HTMLDivElement>();

  useEffect(() => {
    if (nodeRef.current && children) {
      currentChildrenHeight.current = nodeRef.current.children.length * itemHeight;
    }
  }, []);

  function isChildActive(): boolean {
    return children ? children.some((item) => item.id === activeId) : false;
  }

  function getSubMenuItemsHeight(): number {
    return expand && children && currentChildrenHeight.current ? currentChildrenHeight.current : 0;
  }

  function handleMenuItemClick(): void {
    if (mode === 'top') {
      return;
    }
    setExpand((prevExpand) => !prevExpand);
  }

  if (level > maxLevel) return null;

  return (
    <div
      className="duration-300"
      ref={referenceRef}
      onClick={mode === 'top' ? handleClick() : handleMenuItemClick}
    >
      <div
        style={{ height: `${itemHeight}px` }}
        className={cs(
          'relative flex justify-between items-center cursor-pointer',
          'select-none whitespace-nowrap duration-300',
          {
            active: id === activeId,
            collapse: isChildActive(),
          },
        )}
        // onClick={() => !children && history.push('/apps/details')}
      >
        {icon && (
          <Icon
            name={icon}
            className="flex-shrink-0 duration-0"
            size={children || level === 1 ? 24 : 20}
          />
        )}
        <span className="flex-1 text-12 pl-8 transition-opacity duration-300">{title}</span>
        {children && (
          <Icon
            size={22}
            name={'keyboard_arrow_down'}
            className={cs(
              'flex-shrink-0 transform transition-transform duration-300',
              { 'rotate-180': expand },
            )}
          />
        )}
      </div>
      <Popper
        className='bg-white'
        placement='bottom-start'
      >
        <div className='pl-8 pr-16'>
          {children?.map((item) => {
            return (<MenuItem menu={item} key={item.id} level={level + 1} maxLevel={maxLevel} />);
          })}
        </div>
      </Popper>
      {mode === 'side' && (
        <div
          ref={nodeRef}
          style={{ height: getSubMenuItemsHeight() }}
          className={cs(
            'px-16 transition-all duration-300 transform origin-top',
            { 'opacity-0 scale-y-0': !expand },
          )}
        >
          {children?.map((item) => {
            return (<MenuItem menu={item} key={item.id} level={level + 1} maxLevel={maxLevel} />);
          })}
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import cs from 'classnames';
import { useHistory, useParams } from 'react-router-dom';

import Icon from '@c/icon';

export type MenuItemType = {
  id: string;
  title: string;
  icon?: string;
  externalLink?: string;
  children?: Array<MenuItemType>;
}

type Props = {
  menu: MenuItemType;
  level?: number;
  maxLevel?: number;
}

export default function MenuItem({
  menu, level = 1, maxLevel = 3,
}: Props): JSX.Element | null {
  const { id, title, icon, children, externalLink } = menu;
  const history = useHistory();
  const nodeRef = useRef<HTMLDivElement>(null);
  const currentChildrenHeight = useRef<number>();

  const [expand, setExpand] = useState(false);
  const { appID, menuType } = useParams<{ appID: string, menuType: string }>();

  useEffect(() => {
    if (nodeRef.current && children) {
      currentChildrenHeight.current = nodeRef.current.children.length * 40;
    }
  }, []);

  function isChildActive(): boolean {
    return children ? children.some((item) => item.id === menuType) : false;
  }

  function getSubTreeHeight(): number {
    return expand && children && currentChildrenHeight.current ? currentChildrenHeight.current : 0;
  }

  if (level > maxLevel) return null;

  return (
    <div
      className={'app-menu-tree-node duration-300'}
    >
      <div
        className={cs(
          'relative flex justify-between items-center cursor-pointer',
          'h-40 select-none whitespace-nowrap duration-300',
          {
            active: id === menuType,
            collapse: !expand && isChildActive(),
          },
        )}
        onClick={() => {
          if (externalLink) {
            window.location.href = externalLink;
            return;
          }

          setExpand((prevExpand) => !prevExpand);
          !children && history.push(`/apps/details/${appID}/${id}`);
        }}
      >
        {icon && (
          <Icon
            name={icon}
            className={cs('flex-shrink-0 duration-0')}
            size={children || level === 1 ? 24 : 20}
          />
        )}
        <span className="flex-1 text-12 pl-8 transition-opacity duration-300">{title}</span>
        {children && (
          <Icon
            size={22}
            name={'keyboard_arrow_down'}
            className={cs(
              'text-current mr-4 flex-shrink-0 transform transition-transform duration-300',
              { 'rotate-180': expand },
            )}
          />
        )}
      </div>
      <div
        ref={nodeRef}
        style={{ height: getSubTreeHeight() }}
        className={cs(
          'transition-all duration-300 transform origin-top px-16',
          { 'opacity-0 scale-y-0': !expand },
        )}>
        {children?.map((item) => {
          return (<MenuItem menu={item} key={item.id} level={level + 1} maxLevel={maxLevel} />);
        })}
      </div>
    </div>
  );
}

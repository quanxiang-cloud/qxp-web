import React, { useState, useEffect, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import useCss from 'react-use/lib/useCss';

import Icon from '@c/icon';
import cs from 'classnames';

type Props = {
  id: string | number;
  title: string;
  icon: string;
  level?: number;
  children?: Props[];
  maxLevel?: number;
  defaultCollapse?: boolean;
}

export default function TreeNode({
  id, title, icon, children, defaultCollapse, level = 1, maxLevel = 3,
}: Props): JSX.Element | null {
  const history = useHistory();
  const nodeRef = useRef<HTMLDivElement>(null);
  const currentChildrenHeight = useRef<number>();

  const [expand, setExpand] = useState(false);
  const { appID, menuType } = useParams<{ appID: string, menuType: string }>();

  useEffect(() => {
    if (nodeRef.current && children) {
      currentChildrenHeight.current =
        nodeRef.current.children.length * nodeRef.current.children[0].clientHeight;
    }
  }, []);

  useEffect(() => {
    setExpand(!defaultCollapse && isChildActive());
  }, [defaultCollapse]);

  function isChildActive(): boolean {
    return children ? children.some((item) => item.id === menuType) : false;
  }

  function getSubTreeHeight(): number {
    if (defaultCollapse) return 0;
    return expand && children && currentChildrenHeight.current ? currentChildrenHeight.current : 0;
  }

  if (level > maxLevel) return null;

  return (
    <div
      className={cs('app-menu-tree-node duration-300 mb-16 w-40', `node-level-${level}`,
        {
          'w-180': !defaultCollapse || level !== 1,
        })}
    >
      <div
        className={cs(
          'tree-node-title relative flex justify-between items-center cursor-pointer',
          'rounded-8 h-40 select-none duration-300 whitespace-nowrap',
          {
            active: id === menuType,
            collapse: !expand && isChildActive(),
          })}
        onClick={() => {
          setExpand((prevExpand) => !prevExpand);
          !children && history.push(`/apps/details/${appID}/${id}`);
        }}
      >
        <span className="menu-icon flex items-center">
          <Icon
            name={icon}
            className={cs('text-current flex-shrink-0 duration-0', useCss(
              {
                fill: expand ? 'var(--gray-400)' : 'var(--blue-400)',
              }))}
            size={children || level === 1 ? 25 : 21}
          />
          <span
            className={cs(
              'text-12 pl-8 transition-opacity duration-300',
              {
                'opacity-0': defaultCollapse,
              })}>
            {title}
          </span>
        </span>
        {
          children && !defaultCollapse && (
            <span>
              <Icon
                size={22}
                name={'keyboard_arrow_down'}
                className={cs(
                  'text-current mr-4 flex-shrink-0 transform transition-transform duration-300',
                  {
                    'rotate-180': expand,
                  })}
              />
            </span>)
        }
      </div>
      <div
        ref={nodeRef}
        style={{ height: getSubTreeHeight() }}
        className={cs('tree-child-node transition-all duration-300 transform origin-top',
          {
            'opacity-0 scale-y-0': !expand,
          })}>
        {children?.map((item) => <TreeNode {...item} key={item.id} level={level + 1} maxLevel={maxLevel} />)}
      </div>
    </div>
  );
}

import React, { useState, useEffect, Fragment, useMemo } from 'react';
import cs from 'classnames';

import Icon, { iconColor } from '@c/icon';

import { treeFind, findFirstLeafNode } from './utils';
import './index.scss';

export { pageListToTree, treeFind } from './utils';

export type NodeItem<T> = {
  title: string;
  type: 'group' | 'leaf' | string;
  id: string;
  iconName?: string;
  iconColor?: iconColor;
  children?: NodeItem<T>[];
  source?: T;
  parentID?: string;
  root?: boolean;
  hasChild?: boolean;
  childResolved?: boolean;
  disableSelect?: boolean;
  [key: string]: any;
}

type Props<T> = {
  menus: NodeItem<T>[];
  actions?: (node: NodeItem<T>) => React.ReactNode;
  defaultSelected?: string;
  className?: string;
  style?: React.CSSProperties;
  onSelect?: (node: NodeItem<T>) => void;
  groupBanSelect?: boolean;
}

interface NavItemProps<T> {
  node: NodeItem<T>;
  level?: number;
  onSelect?: (node: NodeItem<T>)=> void;
  onToggle?: (node: NodeItem<T>, expand: boolean)=> void;
  actions?: (node: NodeItem<T>) => React.ReactNode;
  activeNode?: NodeItem<T>;
  groupBanSelect: boolean
}

function NavItem<T>({
  node,
  level = 0,
  activeNode,
  onSelect,
  onToggle,
  actions,
  groupBanSelect,
}: NavItemProps<T>): JSX.Element {
  const [expand, setExpand] = useState(!!node.root);
  const [iconName, iconColor] = useMemo(()=> {
    const hasChild = !!(node.children && node.children.length) || !!node.hasChild;
    if (node.type === 'group') {
      if (hasChild) {
        return expand ? 'folder_open' : 'folder';
      }
      return 'folder_empty';
    }
    return [node.iconName || '', node.iconColor || ''];
  }, [node, expand]);

  return (
    <Fragment key={node.id}>
      <div
        style={{ paddingLeft: (16 * (level + 1)) + 'px' }}
        key={node.id}
        className={cs('two-level-menu-node px-16  hover:bg-white flex items-center h-36', {
          'two-level-menu-node-active bg-white': (!groupBanSelect || node.type !== 'group') && activeNode?.id === node.id,
        })}
        onClick={() => {
          setExpand(!expand);
          onToggle?.(node, !expand);
          onSelect?.(node);
        }}
      >
        {iconName && <Icon className='mr-4' color={iconColor as iconColor} size={16} name={iconName} />}
        <span style={{ lineHeight: '36px' }} className='flex-1 truncate'>
          {node.title}
        </span>
        <div className='two-level-menu-actions'>{actions?.(node)}</div>
      </div>
      {node.children && (
        <div
          className={cs(
            'two-level-menu-sub-nodes flex flex-col overflow-hidden',
            `two-level-menu-child-box-${expand ? 'open' : 'close'}`)}
        >
          {node.children.map((c)=> (
            <NavItem
              key={c.id}
              node={c}
              level={level + 1}
              onSelect={onSelect}
              onToggle={onToggle}
              actions={actions}
              activeNode={activeNode}
              groupBanSelect={groupBanSelect}
            />
          ))}
        </div>
      )}
    </Fragment>
  );
}

function TwoLevelMenu<T>({
  menus,
  actions,
  onSelect,
  defaultSelected,
  className,
  style,
  groupBanSelect = false,
}: Props<T>): JSX.Element {
  const [activeNode, setActiveNode] = useState<NodeItem<T> | undefined>(undefined);

  useEffect(() => {
    let _activeNode = undefined;
    if (!defaultSelected) {
      _activeNode = findFirstLeafNode(menus);
    } else if (defaultSelected !== activeNode?.id) {
      _activeNode = treeFind(menus, defaultSelected);
    }

    _activeNode && handleSelect(_activeNode);
  }, [defaultSelected]);

  function handleSelect(node: NodeItem<T>): void {
    !node.disableSelect && setActiveNode(node);
    if (groupBanSelect && node.type === 'group') return;
    onSelect?.(node);
  }

  return (
    <div
      style={style}
      className={cs('text-12', 'overflow-auto', 'beauty-scroll', 'bg-gray-50', className)}
    >
      {menus.map((menu)=> (
        <NavItem
          key={menu.id}
          node={menu}
          onSelect={handleSelect}
          actions={actions}
          activeNode={activeNode}
          groupBanSelect={groupBanSelect}
        />
      ))}
    </div>
  );
}

export default TwoLevelMenu;

import React, { useState, useEffect, Fragment, useMemo } from 'react';
import cs from 'classnames';

import Icon from '@c/icon';

import { treeFind, findFirstLeafNode } from './utils';
import './index.scss';

export { pageListToTree, treeFind } from './utils';

export type NodeItem<T> = {
  title: string;
  type: 'group' | 'leaf' | string;
  id: string;
  iconName?: string;
  child?: NodeItem<T>[];
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
}

interface NavItemProps<T> {
  node: NodeItem<T>;
  level?: number;
  onSelect?: (node: NodeItem<T>)=> void;
  onToggle?: (node: NodeItem<T>, expand: boolean)=> void;
  actions?: (node: NodeItem<T>) => React.ReactNode;
  activeNode?: NodeItem<T>;
}

function NavItem<T>({
  node,
  level = 0,
  activeNode,
  onSelect,
  onToggle,
  actions,
}: NavItemProps<T>): JSX.Element {
  const [expand, setExpand] = useState(!!node.root);
  const iconName = useMemo(()=> {
    const hasChild = !!(node.child && node.child.length) || !!node.hasChild;
    if (node.type === 'group') {
      if (hasChild) {
        return expand ? 'folder_open' : 'folder';
      }
      return 'folder_empty';
    }
    return node.iconName || '';
  }, [node, expand]);

  return (
    <Fragment key={node.id}>
      <div
        className={cs('two-level-menu-node select-none px-16 cursor-pointer hover:bg-white hover:text-gray-900 flex items-center h-36', {
          'two-level-menu-node-active bg-white text-gray-900 relative': activeNode?.id === node.id,
        })}
        onClick={() => {
          setExpand(!expand);
          onToggle?.(node, !expand);
          onSelect?.(node);
        }}
        style={{ paddingLeft: (16 * (level + 1)) + 'px' }}
        key={node.id}
      >
        {iconName && <Icon className='mr-4' size={16} name={iconName} />}
        <span
          style={{ lineHeight: '36px' }}
          className='flex-1 truncate'
        >
          {node.title}
        </span>
        <div className='two-level-menu-actions'>{actions?.(node)}</div>
      </div>
      {node.child && (
        <div
          className={cs(
            'two-level-menu-sub-nodes flex flex-col overflow-hidden',
            `two-level-menu-child-box-${expand ? 'open' : 'close'}`)}
        >
          {node.child.map((c)=> (
            <NavItem
              key={c.id}
              node={c}
              level={level + 1}
              onSelect={onSelect}
              onToggle={onToggle}
              actions={actions}
              activeNode={activeNode}
            />
          ))}
        </div>
      )}
    </Fragment>
  );
}

function TwoLevelMenu<T>({ menus, actions, onSelect, defaultSelected, className, style }: Props<T>): JSX.Element {
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
    onSelect?.(node);
  }

  return (
    <div
      className={`text-12 overflow-auto beauty-scroll bg-gray-50 ${className}`}
      style={style}
    >
      {menus.map((menu)=> (
        <NavItem
          key={menu.id}
          node={menu}
          onSelect={handleSelect}
          actions={actions}
          activeNode={activeNode}
        />
      ))}
    </div>
  );
}

export default TwoLevelMenu;

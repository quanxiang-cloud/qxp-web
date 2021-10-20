import React, { useState, useEffect } from 'react';
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
}

type Props<T> = {
  menus: NodeItem<T>[];
  actions?: (node: NodeItem<T>) => React.ReactNode;
  defaultSelected?: string;
  className?: string;
  onSelect?: (node: NodeItem<T>) => void;
}

type NodeListProps<T> = {
  nodes: NodeItem<T>[];
  handleSelect: (node: NodeItem<T>) => void;
  handleToggle: (id: string) => void;
  visibleList: string[];
  actions?: (node: NodeItem<T>) => React.ReactNode;
  willCloseMap: Record<string, boolean>;
  level?: number;
  activeNode?: NodeItem<T>;
}

const ACTIVE_NODE = 'two-level-menu-node-active bg-white text-gray-900 relative';
const NODE_CLASS = 'two-level-menu-node select-none px-16 h-36 cursor-pointer hover:bg-white hover:text-gray-900 flex items-center';

function getGroupIcon(hasChild: boolean, isOpen: boolean): string {
  if (hasChild) {
    return isOpen ? 'folder_open' : 'folder';
  }

  return 'folder_empty';
}

function NodeList<T>({ nodes, level = 0, ...other }: NodeListProps<T>): JSX.Element {
  const { handleSelect, handleToggle, visibleList, actions, willCloseMap, activeNode } = other;
  return (
    <>
      {nodes.map((node) => {
        if (node.type === 'group') {
          const hasChild = !!(node.child && node.child.length);
          const isOpen = visibleList.includes(node.id);

          const dom = [
            <div onClick={() => handleToggle(node.id)} className={NODE_CLASS} key={node.id}>
              <Icon className='mr-4' size={16} name={getGroupIcon(hasChild, isOpen)} />
              <span className='flex-1 truncate'>{node.title}</span>
              <div className='two-level-menu-actions'>{actions?.(node)}</div>
            </div>,
          ];

          if (hasChild && isOpen) {
            dom.push(
              <div
                style={{
                  '--node-box-height': (36 * (node.child?.length || 0)) + 'px',
                } as React.CSSProperties}
                key={'child-' + node.id}
                className={`two-level-menu-child-box-${willCloseMap[node.id] ? 'close' : 'open'} overflow-hidden h-0`}
              >
                <NodeList
                  nodes={node.child as NodeItem<T>[]}
                  level={level + 1}
                  {...other}
                />
              </div>,
            );
          }

          return dom;
        }

        return (
          <div
            onClick={() => handleSelect(node)}
            className={cs(NODE_CLASS, { [ACTIVE_NODE]: activeNode?.id === node.id })}
            style={{ paddingLeft: (16 * (level + 1)) + 'px' }}
            key={node.id}
          >
            {!!node.iconName && <Icon className='mr-4' size={16} name={node.iconName} />}
            <span
              style={{ lineHeight: '36px' }}
              className='flex-1 truncate'
            >
              {node.title}
            </span>
            <div className='two-level-menu-actions'>{actions?.(node)}</div>
          </div>
        );
      })}
    </>
  );
}

function TwoLevelMenu<T>({ menus, actions, onSelect, defaultSelected, className }: Props<T>): JSX.Element {
  const [visibleList, setVisible] = useState<string[]>([]);
  const [activeNode, setActiveNode] = useState<NodeItem<T> | undefined>(undefined);
  const [willCloseMap, setWillClose] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let _activeNode = undefined;
    if (!defaultSelected) {
      _activeNode = findFirstLeafNode(menus);
    } else if (defaultSelected !== activeNode?.id) {
      _activeNode = treeFind(menus, defaultSelected);
    }

    _activeNode && handleSelect(_activeNode);
    _activeNode?.parentID && setVisible([...visibleList, _activeNode?.parentID]);
  }, [defaultSelected]);

  function handleSelect(node: NodeItem<T>): void {
    setActiveNode(node);
    onSelect?.(node);
  }

  function handleToggle(id: string): void {
    if (visibleList.includes(id)) {
      setWillClose({ ...willCloseMap, [id]: true });
      setTimeout(() => {
        setVisible(
          visibleList.filter((_id) => _id !== id),
        );
        setWillClose({ ...willCloseMap, [id]: false });
      }, 100);
    } else {
      setVisible([...visibleList, id]);
    }
  }

  return (
    <div className={`text-14 overflow-auto beauty-scroll bg-gray-50 ${className}`}>
      <NodeList
        handleToggle={handleToggle}
        nodes={menus}
        handleSelect={handleSelect}
        visibleList={visibleList}
        actions={actions}
        willCloseMap={willCloseMap}
        activeNode={activeNode}
      />
    </div>
  );
}

export default TwoLevelMenu;

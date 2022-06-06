import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Node } from '@one-for-all/artery';
import type { ReactComp } from '@pageDesign/blocks/fountainhead/type';
import { isArray } from 'lodash';

import { filterChildren, getRealNode } from '../utils';
import OutlineLine from './outline-line';
import OutlineItem from './outline-item';
import { useComponents } from '../../fountainhead/store';

export type ListItem = {
  id: string,
  title: string,
  Icon?: ReactComp,
  isLeaf: boolean,
  data: Node,
  level: number,
  isExpand: boolean,
};

interface Props {
  rootNode: Node;
}

export default function OutlineRender({ rootNode }: Props): JSX.Element {
  const components = useComponents();
  const [list, setList] = useState<ListItem[]>();
  const [unExpand, setUnExpand] = useState<string[]>([]);
  const [maxLevel, setMaxLevel] = useState(0);
  const maxLevelRef = useRef(0);

  useEffect(() => {
    setList(treeToList(rootNode, 0, unExpand));
    setMaxLevel(maxLevelRef.current);
    maxLevelRef.current = 0;
  }, [rootNode, components, unExpand]);

  function treeToList(node: Node, level: number, unExpand: string[]): ListItem[] {
    const realNode = getRealNode(node);

    if (!realNode) return [];

    if (isArray(realNode)) {
      return forestToList(level, unExpand, filterChildren(realNode));
    }

    if (realNode.type === 'html-element' || realNode.type === 'react-component') {
      const nodeName = realNode.type === 'html-element' ? realNode.name : realNode.exportName;

      const afterFilterChildren = filterChildren(realNode.children);

      const isExpand = !unExpand.includes(realNode.id);

      const curList = {
        id: realNode.id,
        title: realNode.label || nodeName,
        isLeaf: !afterFilterChildren?.length,
        data: realNode,
        Icon: components?.find((component) => component.name === nodeName)?.Icon,
        level,
        isExpand,
      };
      if (level > maxLevelRef.current) maxLevelRef.current = level;

      if (isExpand) {
        return [curList, ...forestToList(level + 1, unExpand, afterFilterChildren)];
      }

      return [curList];
    }

    return [];
  }

  function forestToList(level: number, unExpand: string[], nodes?: Node[]): ListItem[] {
    if (!nodes) return [];

    return nodes.reduce((total: ListItem[], node) => {
      return [...total, ...treeToList(node, level, unExpand)];
    }, []);
  }

  const handleChangeExpand = useCallback((nodeItem: ListItem, expand: boolean): void => {
    if (expand) {
      setUnExpand((unExpand) => unExpand.filter((id) => id !== nodeItem.id));
      return;
    }

    setUnExpand((unExpand) => [...unExpand, nodeItem.id]);
  }, []);

  return (
    <div className="relative">
      <OutlineLine level={maxLevel} />
      {list?.map((item) => (
        <OutlineItem
          key={item.id}
          item={item}
          onChangeExpand={handleChangeExpand}
        />
      ))}
    </div>
  );
}

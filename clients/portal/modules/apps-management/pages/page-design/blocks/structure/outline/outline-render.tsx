import React, { useState, useEffect } from 'react';
import type { Node } from '@one-for-all/artery';
import type { ReactComp } from '@pageDesign/blocks/fountainhead/type';
import { isArray } from 'lodash';

import { filterChildren, getRealNode } from '../utils';
import { useOutLineContext } from './context';
import OutlineItem from './outline-item';

type ListItem = {
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
  const { components, modifiedNodeName } = useOutLineContext() || {};
  const [list, setList] = useState<ListItem[]>();
  const [unExpand, setUnExpand] = useState<string[]>([]);

  useEffect(() => {
    setList(treeToList(rootNode, 0, unExpand));
  }, [rootNode, components, unExpand]);

  function treeToList(node: Node, level: number, unExpand: string[]): ListItem[] {
    const realNode = getRealNode(node);

    if (!realNode) return [];

    if (isArray(realNode)) {
      return treeArrayToList(level, unExpand, filterChildren(realNode));
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

      if (isExpand) {
        return [curList, ...treeArrayToList(level + 1, unExpand, afterFilterChildren)];
      }

      return [curList];
    }

    return [];
  }

  function treeArrayToList(level: number, unExpand: string[], nodes?: Node[]): ListItem[] {
    if (!nodes) return [];

    return nodes.reduce((total: ListItem[], node) => {
      return [...total, ...treeToList(node, level, unExpand)];
    }, []);
  }

  function handleChangeExpand(nodeItem: ListItem, expand: boolean): void {
    if (expand) {
      setUnExpand(unExpand.filter((id) => id !== nodeItem.id));
      return;
    }

    setUnExpand([...unExpand, nodeItem.id]);
  }

  return (
    <div>
      {list?.map((item) => (
        <OutlineItem
          key={item.id}
          id={item.id}
          nodeName={item.title}
          ComponentIcon={item.Icon}
          node={item.data}
          level={item.level}
          expand={item.isExpand}
          isLeaf={item.isLeaf}
          onChangeExpand={(expand) => handleChangeExpand(item, expand)}
          onModifiedNodeName={(nodeName) => modifiedNodeName?.(item.data, nodeName)}
        />
      ))}
    </div>
  );
}

import type { Artery, Node, ReactComponentNode } from '@one-for-all/artery';
import { HTMLNode } from '@one-for-all/artery-utils';
import { useCallback, useContext, useMemo } from 'react';

import FountainContext from '../../fountain-context';

export function useOutlineRootNode(
  artery: Artery,
  onChange: (artery: Artery) => void,
  activeOverLayerNodeID?: string,
): { rootNode: Node | undefined; onChangeNode: (node: Node) => void } {
  const { getNodePropsSpec } = useContext(FountainContext);
  const modalLayerRoots: Node[] = useMemo(() => {
    if (!('children' in artery.node)) {
      return [];
    }

    return (
      artery.node.children?.filter((n) => {
        if (n.type !== 'react-component') {
          return false;
        }

        return !!getNodePropsSpec(n)?.isOverLayer;
      }) || []
    );
  }, [artery.node]);

  const rootNode = useMemo(() => {
    if (!('children' in artery.node)) {
      return artery.node;
    }

    if (activeOverLayerNodeID) {
      return modalLayerRoots.find(({ id }) => id === activeOverLayerNodeID);
    }

    const filteredFirstLevelNode = (artery.node.children || []).filter((firstLevelChild) => {
      if (firstLevelChild.type !== 'react-component') {
        return true;
      }

      return !modalLayerRoots.map(({ id }) => id).includes(firstLevelChild.id);
    });

    return { ...artery.node, children: filteredFirstLevelNode };
  }, [artery, modalLayerRoots, activeOverLayerNodeID]);

  const onChangeNode = useCallback((node: Node) => {
    if (!('children' in artery.node)) {
      return;
    }

    if (activeOverLayerNodeID) {
      const firstLevelChildren = (artery.node.children || []).map((firstLevelChild) => {
        if (firstLevelChild.id !== activeOverLayerNodeID) {
          return firstLevelChild;
        }

        return node;
      });

      return onChange({ ...artery, node: { ...artery.node, children: firstLevelChildren } });
    }

    const _node = {
      ...node,
      children: (node as HTMLNode | ReactComponentNode).children?.concat(modalLayerRoots),
    };

    onChange({ ...artery, node: _node });
  }, [activeOverLayerNodeID, artery]);

  return { rootNode, onChangeNode };
}

interface OutlineLayer {
  name: string;
  id: string;
  active: boolean;
}

export function useLayerList(artery: Artery, activeOverLayerNodeID?: string): OutlineLayer[] {
  const { getNodePropsSpec } = useContext(FountainContext);
  const outlineLayers: OutlineLayer[] = [
    { id: artery.node.id, name: artery.node.label || artery.node.id, active: !activeOverLayerNodeID },
  ];

  if ('children' in artery.node) {
    artery.node.children?.forEach((firstLevelChild) => {
      if (firstLevelChild.type !== 'react-component') {
        return;
      }

      if (getNodePropsSpec(firstLevelChild)?.isOverLayer) {
        outlineLayers.push({
          id: firstLevelChild.id,
          name: firstLevelChild.label || firstLevelChild.id,
          active: activeOverLayerNodeID === firstLevelChild.id,
        });
      }
    });
  }

  return outlineLayers;
}

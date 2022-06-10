// artery => node list => draggingNode => node list
// node list => forest
// hover state
import { ImmutableNode, KeyPath, _flat } from '@one-for-all/artery-utils';

import { Artery, Node } from '@one-for-all/artery';
import { fromJS } from 'immutable';
import { useMemo } from 'react';

function todoFixMeIsModalLayer(node: Node): boolean {
  return false;
}

function useFlattenNodes(artery: Artery, draggingNodeID: string): Array<[KeyPath, ImmutableNode]> {
  const pairsList = useMemo(() => {
    const node = fromJS(artery.node);
    const firstLevelChildrenCount = node.getIn(['children'])?.size || 0;
    if (!firstLevelChildrenCount) {
      return [];
    }

    const firstLevelChildren = node.getIn(['children']);
    const pureChildren = firstLevelChildren.filter((child) => {
      return child
    })

    const modalLayerNodeKeyPathsCollection = [];
    for (let index = 0; index < firstLevelChildrenCount; index += 1) {
      node.getIn(['children', index])
    }

    const flattenNodes = _flat();
    flattenNodes
  }, [artery.node]);

  useMemo(() => {

  }, [pairsList, draggingNodeID]);
}


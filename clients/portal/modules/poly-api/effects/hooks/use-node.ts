import { useMemo } from 'react';
import { useStoreState, useStoreActions } from 'react-flow-renderer';
import { merge } from 'ramda';

export default function useNode(nodeId: string): [
  POLY_API.NodeElement | undefined, (node: POLY_API.NodeElement) => void
] {
  const nodes = useStoreState((elements) => elements.nodes);
  const edges = useStoreState((elements) => elements.edges);
  const setElements = useStoreActions((actions) => actions.setElements);

  function setCurrentNode(node: POLY_API.NodeElement): void {
    setElements([
      ...nodes.map((curNode) => node.id === curNode.id ? merge(curNode, node) : curNode),
      ...edges,
    ]);
  }

  const currentNode = useMemo(() => nodes.find((node) => node.id === nodeId), [nodes, nodeId]);

  return [currentNode, setCurrentNode];
}

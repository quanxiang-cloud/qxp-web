import { useMemo } from 'react';
import { useStoreState, Node, useStoreActions } from 'react-flow-renderer';
import { merge } from 'ramda';

export default function useNode(nodeId: string): [
  Node<POLY_API.PolyNode> | undefined, (node: Node<POLY_API.PolyNode>) => void
] {
  const nodes = useStoreState((elements) => elements.nodes);
  const edges = useStoreState((elements) => elements.edges);
  const setElements = useStoreActions((actions) => actions.setElements);

  function setCurrentNode(node: Node<POLY_API.PolyNode>): void {
    setElements([
      ...nodes.map((curNode) => node.id === curNode.id ? merge(curNode, node) : curNode),
      ...edges,
    ]);
  }

  const currentNode = useMemo(() => nodes.find((node) => node.id === nodeId), [nodes, nodeId]);

  return [currentNode, setCurrentNode];
}

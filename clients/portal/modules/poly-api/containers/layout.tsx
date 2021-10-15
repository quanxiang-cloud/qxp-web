import { Node, Edge, Elements } from 'react-flow-renderer';
import ELK, { ElkNode, ElkExtendedEdge } from 'elkjs/lib/elk.bundled.js';

const elk = new ELK();

const createGraphLayoutElk = async (
  flowNodes: Node<POLY_API.PolyNode>[], flowEdges: Edge<POLY_API.PolyNode>[],
): Promise<Elements<POLY_API.PolyNode>> => {
  const elkNodes: ElkNode[] = flowNodes.map((node) => ({
    id: node.id,
    width: node.__rf?.width || 0,
    height: node.__rf?.height || 0,
    layoutOptions: { 'org.eclipse.elk.portConstraints': 'FIXED_SIDE' },
  }));

  const elkEdges: ElkExtendedEdge[] = flowEdges.map((edge) => ({
    id: edge.id,
    sources: [edge.source],
    targets: [edge.target],
  }));

  const newGraph = await elk.layout({
    id: 'root',
    layoutOptions: {
      'spacing.nodeNodeBetweenLayers': '100',
      'elk.direction': 'RIGHT',
      'org.eclipse.elk.algorithm': 'org.eclipse.elk.layered',
      'org.eclipse.elk.spacing.nodeNode': '100',
      'org.eclipse.elk.layered.allowNonFlowPortsToSwitchSides': 'true',
    },
    children: elkNodes,
    edges: elkEdges,
  });

  return [
    ...flowNodes.map((nodeState) => {
      const node = newGraph?.children?.find((n) => n.id === nodeState.id);
      if (node?.x && node?.y && node?.width && node?.height) {
        // nodeState.position = { x: node.x + (Math.random() / 1000), y: node.y };
        nodeState.position = { x: node.x, y: node.y };
      }
      return nodeState;
    }),
    ...flowEdges,
  ];
};

export default createGraphLayoutElk;

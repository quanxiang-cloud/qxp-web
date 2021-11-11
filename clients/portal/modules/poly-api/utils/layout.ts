import ELK, { ElkNode, ElkExtendedEdge } from 'elkjs/lib/elk.bundled.js';

const elk = new ELK();

const createGraphLayoutElk = async (
  flowNodes: POLY_API.NodeElement[], flowEdges: POLY_API.EdgeElement[],
): Promise<POLY_API.Element[]> => {
  const elkNodes: ElkNode[] = flowNodes.map((node) => {
    const elkNode = {
      id: node.id,
      width: node.__rf?.width || 200,
      height: node.__rf?.height || 72,
      layoutOptions: {
        'org.eclipse.elk.portConstraints': 'FIXED_SIDE',
      },
    };
    return elkNode;
  });

  const elkEdges: ElkExtendedEdge[] = flowEdges.map((edge) => ({
    id: edge.id,
    sources: [edge.source],
    targets: [edge.target],
  }));

  const newGraph = await elk.layout({
    id: 'root',
    layoutOptions: {
      'org.eclipse.elk.algorithm': 'org.eclipse.elk.layered',
      'spacing.nodeNodeBetweenLayers': '80',
      'org.eclipse.elk.spacing.nodeNode': '79',
      'elk.direction': 'RIGHT',
      'org.eclipse.elk.layered.allowNonFlowPortsToSwitchSides': 'true',
      'org.eclipse.elk.layered.nodePlacement.bk.fixedAlignment': 'BALANCED',
      'org.eclipse.elk.layered.contentAlignment': 'H_LEFT',
    },
    children: elkNodes,
    edges: elkEdges,
  });

  return [
    ...flowNodes.map((nodeState) => {
      const node = newGraph?.children?.find((n) => n.id === nodeState.id);
      if (node?.x && node?.y && node?.width && node?.height) {
        nodeState.position = { x: node.x + (Math.random() / 1000), y: node.y };
        nodeState.__rf.position = { ...nodeState.position };
      }
      return nodeState;
    }),
    ...flowEdges,
  ];
};

export default createGraphLayoutElk;

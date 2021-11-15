import store$ from '../store';

export default function getPathTreeSource(currentNodeId: string): POLY_API.PlainElement[] {
  const { nodes = [] } = store$.getRootValue();
  const nodeIdMap = nodes.reduce((acc: Record<string, POLY_API.PlainElement>, node) => {
    acc[node.id] = node;
    return acc;
  }, {});

  const nodeParentsMap = new Map<POLY_API.PlainElement, POLY_API.PlainElement[]>();
  nodes.forEach((node) => {
    const { nextNodes = [] } = node.data || {};
    nextNodes.forEach((id) => {
      const child = nodeIdMap[id];
      if (!child) {
        return;
      }
      if (nodeParentsMap.has(child)) {
        nodeParentsMap.get(child)?.push(node);
      } else {
        nodeParentsMap.set(child, [node]);
      }
    });
  });

  const currentNode = nodeIdMap[currentNodeId];
  const processQueue = [currentNode];
  const previousNodes: POLY_API.PlainElement[] = [];
  while (processQueue.length) {
    const current = processQueue.shift() as POLY_API.PlainElement;
    const parents = nodeParentsMap.get(current) || [];
    previousNodes.push(...parents);
    processQueue.push(...parents);
  }

  return previousNodes;
}

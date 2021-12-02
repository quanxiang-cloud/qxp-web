import { uniqBy } from 'ramda';

import store$ from '../store';
import { PATH_TREE_AVAILABLE_NODE_TYPE } from '../constants';

const uniqByName = uniqBy(({ name }: POLY_API.PolyNodeInput) => name);

export function addNodeNamePrefix2PolyNodeInput(
  inputs: POLY_API.PolyNodeInput[], prefix: POLY_API.PolyNodeInput,
): POLY_API.PolyNodeInput {
  prefix.data = inputs;
  return prefix;
}

export default function getPathTreeSource(currentNodeId: string): POLY_API.PolyNodeInput[] {
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

  return uniqByName(previousNodes
    .reverse()
    .filter((node) => PATH_TREE_AVAILABLE_NODE_TYPE.includes(node?.type || ''))
    .map((node) => {
      let inputsOrOutputs: POLY_API.PolyNodeInput[] = [];
      if (node.data?.type === 'input') {
        inputsOrOutputs = node.data.detail.inputs;
      } else if (node.data?.type === 'request') {
        inputsOrOutputs = node.data.detail.outputs || [];
      }
      return addNodeNamePrefix2PolyNodeInput(inputsOrOutputs, {
        type: 'object',
        name: node.id,
        desc: node.data?.title || '开始节点',
        data: [],
        in: 'body',
        required: true,
      });
    }));
}

import { Node } from 'react-flow-renderer';

export type NodeSize = {
  width: number;
  height: number;
}

export type GetNodeSizeReturn = (id: string) => NodeSize;

export default function useGetNodeSize(nodesStates: Node[]): GetNodeSizeReturn {
  const nodesStatesMap = nodesStates.reduce((acc: Record<string, Node>, state) => {
    acc[state.id] = state;
    return acc;
  }, {});

  const resultMap: Record<string, NodeSize> = {};
  function getNodeSizeById(id: string): NodeSize {
    if (resultMap[id]) {
      return resultMap[id];
    }
    const node: Node | undefined = nodesStatesMap[id];
    const result = { width: node?.__rf?.width || 0, height: node?.__rf?.height || 0 };
    resultMap[id] = result;
    return result;
  }

  return getNodeSizeById;
}

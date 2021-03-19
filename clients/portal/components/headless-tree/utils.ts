export function flatTree(parentNode: TreeNode<any>): TreeNode<any>[] {
  return [parentNode].concat(...(parentNode.children || [])
      .map((child: TreeNode<any>) => flatTree(child)));
}

export function findNode(currentNode: TreeNode<any>, nodeID: string): TreeNode<any> | null {
  if (currentNode.id === nodeID) {
    return currentNode;
  }

  for (const node of (currentNode.children || [])) {
    if (node.id === nodeID) {
      return node;
    }

    const foundNode = findNode(node, nodeID);

    if (foundNode) {
      return foundNode;
    }
  }

  return null;
}

export function getNodeParents(
    currentNode: TreeNode<any>,
    nodeID: string,
    parents: TreeNode<any>[],
): boolean {
  if (currentNode.id === nodeID) {
    return true;
  }

  for (const node of (currentNode.children || [])) {
    if (getNodeParents(node, nodeID, parents)) {
      parents.push(node);
      return true;
    }
  }

  return false;
}

export function addChildren(parentNode: TreeNode<any>, nodes: TreeNode<any>[]): TreeNode<any> {
  const _parentNode = { ...parentNode };
  const idSet = new Set();
  const childrenNodes = nodes.concat((parentNode.children || []).slice())
      .filter((node: TreeNode<any>) => {
        if (idSet.has(node.id)) {
          return false;
        }

        idSet.add(node.id);

        return true;
      }).map((node) => {
        return {
          ...node,
          parentId: parentNode.id,
          level: parentNode.level + 1,
        };
      }).map((node) => {
        return addChildren(node, node.children || []);
      });

  _parentNode.children = childrenNodes.sort((nodeA: TreeNode<any>, nodeB: TreeNode<any>) => {
    if (nodeA.isLeaf === nodeB.isLeaf) {
      return nodeA.order < nodeB.order ? -1 : 1;
    }

    return nodeA.isLeaf ? 1 : -1;
  });

  return _parentNode;
}

export function defaultGetChildren(): Promise<TreeNode<any>[]> {
  return Promise.resolve([]);
}

export function updateNode(currentNode: TreeNode<any>, node: TreeNode<any>): TreeNode<any> {
  if (currentNode.id === node.id) {
    return node;
  }

  return {
    ...currentNode,
    children: (currentNode.children || []).map((childNode) => {
      return updateNode(childNode, node);
    }),
  };
}

export function patchAllNodes(node: TreeNode<any>, partialValue: Partial<TreeNode<any>>): TreeNode<any> {
  return {
    ...node,
    ...partialValue,
    children: node.children?.map((child): TreeNode<any> => patchAllNodes(child, partialValue)),
  };
}

type NodeMap<T> = Record<string, TNode<T>>

const nodeMap: NodeMap<any> = {};

function toggleNode(
    id: string,
    checkStatus: 'checked' | 'unchecked',
) {
  if (!nodeMap[id]) {
    return;
  }

  if (nodeMap[id].checkStatus === checkStatus) {
    return;
  }

  nodeMap[id].checkStatus = checkStatus;
  (nodeMap[id].children || []).forEach((id) => {
    toggleNode(id, checkStatus);
  });

  const parentID = nodeMap[id].parentID;
  if (!parentID || nodeMap[parentID]) {
    return;
  }

  handlePropagate(parentID, checkStatus);
}

function handlePropagate(id: string, childCheckStatus: CheckStatus) {
  if (!nodeMap[id]) {
    return;
  }

  const checkStatus = nodeMap[id].checkStatus;

  // P: parent checkStatus
  // C: child checkStatus
  // | P\C | ✅    | ❌    | ❓    |
  // | ---- | ---- | ---- | ---- |
  // | ✅    | ⏹    | ❓    | ❓    |
  // | ❌    | ❓    | ⏹    | ❓    |
  // | ❓    | 🧮    | 🧮    | ⏹    |
  if (checkStatus === childCheckStatus) {
    return;
  }

  if (
    childCheckStatus === 'indeterminate' ||
    checkStatus === 'unchecked' ||
    (checkStatus === 'checked' && childCheckStatus == 'unchecked')
  ) {
    nodeMap[id].checkStatus = 'indeterminate';
    if (nodeMap[id].parentID) {
      handlePropagate(nodeMap[id].parentID as string, 'indeterminate');
    }
    return;
  }

  if (childCheckStatus === 'checked') {
    const allChildrenChecked = nodeMap[id].children?.every((childID) => {
      return nodeMap[childID].checkStatus === 'checked';
    });

    nodeMap[id].checkStatus = allChildrenChecked ? 'checked' : 'indeterminate';
    handlePropagate(nodeMap[id].parentID as string, nodeMap[id].checkStatus);
  }

  if (childCheckStatus === 'unchecked') {
    const hasCheckedChild = nodeMap[id].children?.some((childID) => {
      return nodeMap[childID].checkStatus === 'checked' ||
        nodeMap[childID].checkStatus === 'indeterminate';
    });

    nodeMap[id].checkStatus = hasCheckedChild ? 'indeterminate' : 'unchecked';
    handlePropagate(nodeMap[id].parentID as string, nodeMap[id].checkStatus);
  }
}

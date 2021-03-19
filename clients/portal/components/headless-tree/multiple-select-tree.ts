import { action, computed } from 'mobx';
import BaseStore, { TreeStorProps } from './store';

type NodeMap<T> = Record<string, TNode<T>>
type SelectedNodePaths<T> = Array<Array<TNode<T>>>

function selectedNodes<T>(nodeMap: NodeMap<T>, parentID: string): SelectedNodePaths<T> {
  if (nodeMap[parentID].checkStatus === 'checked') {
    return [[nodeMap[parentID]]];
  }

  let selectedNodePaths: SelectedNodePaths<T> = [];
  nodeMap[parentID].children?.forEach((id) => {
    const childSelectedPaths = selectedNodes(nodeMap, id);
    childSelectedPaths.forEach((path) => {
      path.unshift(nodeMap[parentID]);
    });

    selectedNodePaths = childSelectedPaths;
  });

  return selectedNodePaths;
}

class SelectableTreeStore<T> extends BaseStore<T> {
  _nodeMap: NodeMap<T> = {};
  nodeMap: NodeMap<T> = {};

  constructor(props: TreeStorProps<T>) {
    super(props);

    this.generateNodeMap();
  }

  generateNodeMap() {
    // todo support initial check status
    this._nodeMap = this.nodeList.reduce<NodeMap<T>>((nodeMap, node) => {
      nodeMap[node.id] = {
        data: node.data,
        id: node.id,
        parentID: node.parentId,
        children: node.children?.map(({ id }) => id),
        checkStatus: 'unchecked',
      };

      return nodeMap;
    }, {});
  }

  @computed get SelectedNodePaths(): SelectedNodePaths<T> {
    const rootNodeID = this.rootNode.id;

    return selectedNodes(this.nodeMap, rootNodeID);
  }

  @action
  toggleCheck(id: string, checkStatus: 'checked' | 'unchecked') {
    this._toggleCheck(id, checkStatus);

    this.nodeMap = this._nodeMap;
  }

  _toggleCheck(id: string, checkStatus: 'checked' | 'unchecked') {
    if (!this._nodeMap[id]) {
      return;
    }

    if (this._nodeMap[id].checkStatus === checkStatus) {
      return;
    }

    this._nodeMap[id].checkStatus = checkStatus;
    (this._nodeMap[id].children || []).forEach((id) => {
      this._toggleCheck(id, checkStatus);
    });

    const parentID = this._nodeMap[id].parentID;
    if (!parentID || this._nodeMap[parentID]) {
      return;
    }

    this.propagateCheckStatus(parentID, checkStatus);
  }

  propagateCheckStatus(id: string, childCheckStatus: CheckStatus) {
    if (!this._nodeMap[id]) {
      return;
    }

    const checkStatus = this._nodeMap[id].checkStatus;

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
      this._nodeMap[id].checkStatus = 'indeterminate';
      if (this._nodeMap[id].parentID) {
        this.propagateCheckStatus(this._nodeMap[id].parentID as string, 'indeterminate');
      }
      return;
    }

    if (childCheckStatus === 'checked') {
      const allChildrenChecked = this._nodeMap[id].children?.every((childID) => {
        return this._nodeMap[childID].checkStatus === 'checked';
      });

      this._nodeMap[id].checkStatus = allChildrenChecked ? 'checked' : 'indeterminate';
      this.propagateCheckStatus(this._nodeMap[id].parentID as string, this._nodeMap[id].checkStatus);
    }

    if (childCheckStatus === 'unchecked') {
      const hasCheckedChild = this._nodeMap[id].children?.some((childID) => {
        return this._nodeMap[childID].checkStatus === 'checked' ||
          this._nodeMap[childID].checkStatus === 'indeterminate';
      });

      this._nodeMap[id].checkStatus = hasCheckedChild ? 'indeterminate' : 'unchecked';
      this.propagateCheckStatus(this._nodeMap[id].parentID as string, this._nodeMap[id].checkStatus);
    }
  }
}

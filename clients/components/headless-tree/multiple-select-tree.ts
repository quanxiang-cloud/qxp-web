import { flatten } from 'lodash';
import { action, computed, observable, toJS } from 'mobx';

import BaseStore, { TreeStoreProps } from './store';
import { TNode, CheckStatus } from './types';

type NodeMap<T> = Record<string, TNode<T>>
type SelectedNodePaths<T> = Array<Array<TNode<T>>>

function selectedNodes<T>(nodeMap: NodeMap<T>, id: string): SelectedNodePaths<T> {
  if (nodeMap[id] && nodeMap[id].checkStatus === 'checked') {
    return [[toJS(nodeMap[id])]];
  }

  return flatten(nodeMap[id]?.children?.map((childID) => {
    const childSelectedPaths = selectedNodes(nodeMap, childID);
    childSelectedPaths.forEach((path) => {
      path.unshift(toJS(nodeMap[id]));
    });

    return childSelectedPaths;
  }));
}

function selectedNodeSingleMode<T>(nodeMap: NodeMap<T>): SelectedNodePaths<T> {
  return Object.entries(nodeMap)?.reduce((cur: SelectedNodePaths<T>, next) => {
    const [_, node] = next;
    if (node.checkStatus === 'checked') {
      cur.push([toJS(node)]);
    }
    return cur;
  }, []);
}

export default class SelectableTreeStore<T> extends BaseStore<T> {
  _nodeMap: NodeMap<T> = {};
  @observable singleMode: boolean;
  @observable nodeMap: NodeMap<T> = {};

  constructor(props: TreeStoreProps<T>) {
    super(props);

    this.singleMode = !!props.singleMode;
    this.generateNodeMap();
  }

  generateNodeMap(): void {
    // todo support initial check status
    this._nodeMap = this.nodeList?.reduce<NodeMap<T>>((nodeMap, node) => {
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

  @computed get selectedNodePaths(): SelectedNodePaths<T> {
    const rootNodeID = this.rootNode.id;
    if (this.singleMode) {
      return selectedNodeSingleMode(this.nodeMap);
    }
    return selectedNodes(this.nodeMap, rootNodeID);
  }

  @computed get selectedDataPaths(): Array<Array<T>> {
    return this.selectedNodePaths.map((path) => {
      return path.map(({ data }) => data);
    });
  }

  @action
  toggleCheck(id: string, checkStatus?: 'checked' | 'unchecked'): NodeMap<T> | undefined {
    if (!this._nodeMap[id]) {
      return;
    }
    const currentCheckStatus = this._nodeMap[id].checkStatus;
    const targetCheckStatus = currentCheckStatus === 'checked' ? 'unchecked' : 'checked';
    this._toggleCheck(id, checkStatus || targetCheckStatus);

    this.nodeMap = { ...this._nodeMap };
    return this.nodeMap;
  }

  _toggleCheck(id: string, checkStatus: 'checked' | 'unchecked'): void {
    if (!this._nodeMap[id]) {
      return;
    }

    if (this._nodeMap[id].checkStatus === checkStatus) {
      return;
    }

    this._nodeMap[id].checkStatus = checkStatus;
    !this.singleMode && (this._nodeMap[id].children || []).forEach((id) => {
      this._toggleCheck(id, checkStatus);
    });

    const parentID = this._nodeMap[id].parentID;
    if (!parentID || !this._nodeMap[parentID]) {
      return;
    }

    !this.singleMode && this.propagateCheckStatus(parentID, checkStatus);
  }

  propagateCheckStatus(id: string, childCheckStatus: CheckStatus): void {
    if (!this._nodeMap[id]) {
      return;
    }

    const checkStatus = this._nodeMap[id].checkStatus;

    // P: parent checkStatus
    // C: child checkStatus
    // | P\C |  ✅   |  ❌   |  ❓  |
    // | ---- | ---- | ---- | ---- |
    // |  ✅  |  ⏹   |  🧮   |  ❓  |
    // |  ❌  |  🧮   |  ⏹   |  ❓  |
    // |  ❓  |  🧮   |  🧮   |  ⏹  |
    if (checkStatus === childCheckStatus) {
      return;
    }

    if (childCheckStatus === 'checked') {
      const allChildrenChecked = this._nodeMap[id].children?.every((childID) => {
        return this._nodeMap[childID].checkStatus === 'checked';
      });

      this._nodeMap[id].checkStatus = allChildrenChecked ? 'checked' : 'indeterminate';
    } else if (childCheckStatus === 'unchecked') {
      const hasChildChecked = this._nodeMap[id].children?.some((childID) => {
        return this._nodeMap[childID].checkStatus === 'checked' ||
          this._nodeMap[childID].checkStatus === 'indeterminate';
      });

      this._nodeMap[id].checkStatus = hasChildChecked ? 'indeterminate' : 'unchecked';
    } else {
      this._nodeMap[id].checkStatus = 'indeterminate';
    }

    this.propagateCheckStatus(this._nodeMap[id].parentID as string, this._nodeMap[id].checkStatus);
  }
}

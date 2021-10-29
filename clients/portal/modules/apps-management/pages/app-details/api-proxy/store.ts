import { action, observable } from 'mobx';

import TreeStore from '@c/headless-tree/store';
import { TreeNode } from '@c/headless-tree/types';
import toast from '@lib/toast';

import * as apis from './api';

const nsPattern = /system\/app\/[\w-]+\/customer\/?(.*)/;

/*
  ns pattern, root level: /system/app/46ec66c8-280e-4a2d-92ca-3785cde3ea27/customer
  level-1 example: /system/app/46ec66c8-280e-4a2d-92ca-3785cde3ea27/customer/ns-1
  level-2 example:  /system/app/46ec66c8-280e-4a2d-92ca-3785cde3ea27/customer/ns-1/ns-2
 */
function getLevelByNs(ns: string): number {
  const match = ns.match(nsPattern);
  if (match && match[1]) {
    return match[1].split('/').filter(Boolean).length;
  }
  return 0;
}

function convertGroupsToTreeNodes(parent: TreeNode<PolyAPI.Namespace> | null, groups?: PolyAPI.Namespace[]): TreeNode<PolyAPI.Namespace> {
  const mapGroups = (groups || []).map((group)=> {
    return {
      data: group,
      name: group.title || group.name,
      id: group.id,
      parentId: group.parent,
      path: '',
      isLeaf: group.subCount === 0,
      visible: true,
      childrenStatus: group.subCount > 0 ? 'unknown' : 'resolved',
      expanded: false,
      order: 0,
      level: getLevelByNs([group.parent, group.name].join('/')),
    };
  });

  if (parent === null) {
    // auto generate root node
    return {
      id: 'api-ns-root',
      parentId: '',
      name: '',
      path: '',
      isLeaf: false,
      children: mapGroups,
      visible: false,
      data: null as any,
      expanded: true,
      order: 0,
      level: 0,
      childrenStatus: 'unknown',
    };
  }
  return { ...parent, children: mapGroups };
}

export class ApiGroupStore extends TreeStore<PolyAPI.Namespace> {
  constructor(groups?: PolyAPI.Namespace[]) {
    const rootNode = convertGroupsToTreeNodes(null, groups);
    super({ rootNode, onGetChildren, treeNodeHeight: 40 }, false);
  }
}

function onGetChildren(parent: TreeNode<PolyAPI.Namespace>): Promise<TreeNode<PolyAPI.Namespace>[]> {
  const ns = [parent.parentId, parent.data.name].join('/');
  return apis.getNamespaceList(ns, { page: 1, pageSize: -1 }).then(({ list })=> {
    return convertGroupsToTreeNodes(parent, list).children as any;
  });
}

class ApiProxyStore {
  @observable appId='';
  @observable namespaces: PolyAPI.Namespace[] = []; // all namespaces
  @observable activeNs: PolyAPI.Namespace | null = null;
  @observable appRootNs='';
  @observable treeStore: ApiGroupStore | null = null;
  @observable loadingNs=false;
  @observable filterNsList: PolyAPI.Namespace[] | null=null; // filtered ns list, like search
  @observable isLoading=false; // fetching sub page's data

  @action
  setNamespaces=(namespaces: PolyAPI.Namespace[])=> {
    this.namespaces = namespaces;
  }

  @action
  setAppRooNs=(ns: string)=> {
    this.appRootNs = ns;
  }

  @action
  setAppId=(appId: string)=>{
    this.appId = appId;
  }

  @action
  setActiveNs=(ns: PolyAPI.Namespace)=> {
    this.activeNs = ns;
    this.treeStore?.onSelectNode(ns?.id);
  }

  @action
  setTreeStore=(store: ApiGroupStore)=> {
    this.treeStore = store;
  }

  @action
  fetchNamespaces=async (appId: string): Promise<PolyAPI.Namespace[] | void> => {
    this.loadingNs = true;
    try {
      if (!this.appRootNs) {
        const { appPath } = await apis.getAppPath(appId);
        this.setAppRooNs(appPath);
      }
      if (this.appRootNs) {
        const { list = [] } = await apis.getNamespaceList(this.appRootNs, { page: 1, pageSize: -1 });
        this.setNamespaces(list);
        this.setTreeStore(new ApiGroupStore(list));
      }
    } catch (err) {
      toast.error(err);
    } finally {
      this.loadingNs = false;
    }
  }

  @action
  searchNamespace=async (word: string): Promise<PolyAPI.Namespace[] | void> => {
    this.isLoading = true;
    try {
      const { list } = await apis.searchNamespace(this.appRootNs, { title: word });
      this.filterNsList = list;
      this.setTreeStore(new ApiGroupStore(list));
    } catch (err) {
      toast.error(err);
    } finally {
      this.isLoading = false;
    }
  }

  @action
  clearFilterNs=()=> {
    this.filterNsList = null;
  }

  createNs=()=> {

  }

  @action
  reset=()=> {
    this.appId = '';
    this.appRootNs = '';
    this.treeStore = null;
    this.namespaces = [];
    this.filterNsList = null;
    this.loadingNs = false;
    this.isLoading = false;
  }
}

export default new ApiProxyStore();

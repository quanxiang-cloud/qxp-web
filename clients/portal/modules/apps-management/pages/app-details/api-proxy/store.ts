import { action, computed, observable, toJS } from 'mobx';
import { pick } from 'lodash';

import TreeStore from '@c/headless-tree/store';
import { TreeNode } from '@c/headless-tree/types';
import toast from '@lib/toast';

import * as apis from './api';

const nsPattern = /system\/app\/[\w-]+\/customer\/?(.*)/;
const ROOT_NODE_ID = 'api-ns-root';

/*
  ns pattern, root level: /system/app/46ec66c8-280e-4a2d-92ca-3785cde3ea27/customer
  level-1 example: /system/app/46ec66c8-280e-4a2d-92ca-3785cde3ea27/customer/ns-1
  level-2 example:  /system/app/46ec66c8-280e-4a2d-92ca-3785cde3ea27/customer/ns-1/ns-2
 */
export function getLevelByNs(ns: string): number {
  const match = ns.match(nsPattern);
  if (match && match[1]) {
    return match[1].split('/').filter(Boolean).length;
  }
  return 0;
}

function mapGroupsToTreeNodes(groups?: PolyAPI.Namespace[]): TreeNode<PolyAPI.Namespace>[] {
  return (groups || []).map((group) => {
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
}

function getFullNode(parent: TreeNode<PolyAPI.Namespace> | null, nodes: TreeNode<PolyAPI.Namespace>[]): TreeNode<PolyAPI.Namespace> {
  if (parent === null) {
    // auto generate root node
    return {
      id: ROOT_NODE_ID,
      parentId: '',
      name: '',
      path: '',
      isLeaf: false,
      children: nodes,
      visible: false,
      data: null as any,
      expanded: true,
      order: 0,
      level: 0,
      childrenStatus: 'unknown',
    };
  }
  return { ...parent, children: nodes };
}

function onGetChildren(parent: TreeNode<PolyAPI.Namespace>): Promise<TreeNode<PolyAPI.Namespace>[]> {
  const ns = [parent.data.parent, parent.data.name].join('/');
  return apis.getNamespaceList(ns, { page: 1, pageSize: -1 }).then(({ list }) => {
    return mapGroupsToTreeNodes(list);
  });
}

export class ApiGroupStore extends TreeStore<PolyAPI.Namespace> {
  constructor(groups?: PolyAPI.Namespace[]) {
    const rootNode = getFullNode(null, mapGroupsToTreeNodes(groups));
    super({ rootNode, onGetChildren, treeNodeHeight: 36 }, false);
  }

  @computed get curNodeTitle(): string {
    return this.currentFocusedNode?.data?.title || this.currentFocusedNode.name;
  }

  @computed get curNodefullNs(): string {
    const { parent, name } = this.currentFocusedNode?.data || {};
    if (!name) {
      return parent || '';
    }
    return [parent, name].join('/');
  }

  @computed get curNodeSvcPath(): string {
    return [this.curNodefullNs, this.currentFocusedNode?.data.name].join('/');
  }
}

class ApiProxyStore {
  @observable appId = '';
  @observable namespaces: PolyAPI.Namespace[] = []; // all namespaces
  @observable currentNs: PolyAPI.Namespace | null = null;
  @observable appRootNs = '';
  @observable treeStore: ApiGroupStore | null = null;
  @observable loadingNs = false;
  @observable filterNsList: PolyAPI.Namespace[] | null = null; // filtered ns list, like search
  @observable isLoading = false; // fetching sub page's data
  @observable svc: PolyAPI.Service | null=null;
  @observable svcApis: {list?: PolyAPI.Api[], total?: number} | null=null

  @computed get currentSvcPath() {
    if (this.currentNs) {
      const { parent, name } = this.currentNs;
      return [parent, name, name].join('/');
    }
    return '';
  }

  @action
  setNamespaces = (namespaces: PolyAPI.Namespace[]) => {
    this.namespaces = namespaces;
  }

  @action
  setAppRooNs = (ns: string) => {
    this.appRootNs = ns;
  }

  @action
  setAppId = (appId: string) => {
    this.appId = appId;
  }

  @action
  setActiveNs = (ns: PolyAPI.Namespace) => {
    this.currentNs = ns;
    this.treeStore?.onSelectNode(ns?.id);
  }

  @action
  setTreeStore = (store: ApiGroupStore) => {
    this.treeStore = store;
  }

  @action
  fetchNamespaces = async (appId: string): Promise<PolyAPI.Namespace[] | void> => {
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
  searchNamespace = async (word: string): Promise<PolyAPI.Namespace[] | void> => {
    this.loadingNs = true;
    try {
      const { list } = await apis.searchNamespace(this.appRootNs, { title: word });
      this.filterNsList = list;
      this.setTreeStore(new ApiGroupStore(list));
    } catch (err) {
      toast.error(err);
    } finally {
      this.loadingNs = false;
    }
  }

  @action
  clearFilterNs = () => {
    this.filterNsList = null;
  }

  @action
  createNs = async (ns: string, params: PolyAPI.CreateNamespaceParams) => {
    await apis.createNamespace(ns, params);
    // this.treeStore?.addChildren(ROOT_NODE_ID, mapGroupsToTreeNodes([newNs]));
    await this.fetchNamespaces(this.appId);
    toast.success('添加分组成功');
  }

  @action
  updateNs = async (ns: string, params: Omit<PolyAPI.CreateNamespaceParams, 'name'>, node: any) => {
    await apis.updateNamespace(ns, params);
    this.treeStore?.patchNode(node.id, node.name, toJS(node));
    toast.success('修改分组成功');
  }

  @action
  deleteNs = async (ns: string) => {
    await apis.deleteNamespace(ns);
    await this.fetchNamespaces(this.appId);
  }

  @action
  createSvc=async (ns: string, params: PolyAPI.CreateServiceParams)=> {
    await apis.createService(ns, params);
    this.svc = Object.assign({}, this.svc, params, { authContent: params.authorize });
  }

  @action
  updateSvc=async (params: Omit<PolyAPI.CreateServiceParams, 'name'>)=> {
    await apis.updateService(this.currentSvcPath, params);
    this.svc = Object.assign({}, this.svc, params, { authContent: params.authorize });
  }

  @action
  fetchSvc=async ()=> {
    this.isLoading = true;
    try {
      this.svc = await apis.getService(this.currentSvcPath);
    } catch (err) {
      this.svc = null;
    } finally {
      this.isLoading = false;
    }
  }

  @action
  fetchApiListInSvc=async (paging: {page: number; pageSize: number, search?: string})=> {
    this.isLoading = true;
    try {
      if (paging.search) {
        const curNs = [this.currentNs?.parent, this.currentNs?.name].join('/');
        this.svcApis = await apis.searchNativeApi(curNs, {
          ...pick(paging, ['page', 'pageSize']),
          title: paging.search,
          active: -1,
          withSub: false,
        });
      } else {
        this.svcApis = await apis.getServiceApiList(this.currentSvcPath, paging);
      }
    } catch (err) {
      toast.error(err);
    } finally {
      this.isLoading = false;
    }
  }

  @action
  registerApi=async (params: PolyAPI.CreateApiParams)=> {
    await apis.registerApi(this.svc?.fullPath || '', params);
  }

  @action
  disableApi=async (apiPath: string, active: number)=> {
    await apis.activeApi(apiPath, { active });
  }

  @action
  uploadSwagger=async (file: File)=> {
    const fd = new FormData();
    fd.append('version', 'v1');
    fd.append('file', file);
    fd.append('svcPath', this.currentSvcPath);
    await apis.uploadSwagger(fd);
  }

  @action
  reset = () => {
    this.appId = '';
    this.appRootNs = '';
    this.treeStore = null;
    this.namespaces = [];
    this.currentNs = null;
    this.filterNsList = null;
    this.loadingNs = false;
    this.isLoading = false;
    this.svcApis = null;
  }
}

export default new ApiProxyStore();

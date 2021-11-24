import { action, computed, IReactionDisposer, observable, reaction } from 'mobx';
import { isObject } from 'lodash';

import toast from '@lib/toast';
import { deepClone } from '@lib/utils';
import { getTableSchema } from '@lib/http-client';
import { NodeItem, treeFind } from '@c/two-level-menu';

import { fetchDataModels } from '../api';
import { INIT_MODEL_SCHEMA } from './constants';
import { getTableXName, getApiDoc } from './api';
import { INIT_API_CONTENT, INIT_CURRENT_MODEL } from './constants';
import { getAppPath, getNamespaceList, getServiceApiList } from '../api-proxy/api';

type NavItemData=DataModel | PolyAPI.Namespace;

function isApiNode(node: any): boolean {
  return isObject(node) && ('fullPath' in node) && ('method' in node);
}

export function mapNsToNodeItem(ns: PolyAPI.Namespace | PolyAPI.Api): NodeItem<PolyAPI.Namespace | PolyAPI.Api> {
  const hasChild = ns.subCount > 0;
  const node = {
    id: ns.id,
    title: ns.title || ns.name,
    type: 'group', // namespace or service always group type
    source: ns,
    parentID: ns.parent,
    hasChild,
    apisResolved: false,
    // disableSelect: true,
  };
  if (hasChild) {
    Object.assign(node, {
      child: Array.isArray(ns.child) ? ns.child.map(mapNsToNodeItem) : undefined,
      childResolved: Array.isArray(ns.child),
    });
  } else if (Array.isArray(ns.child)) {
    Object.assign(node, {
      // @ts-ignore
      child: ns.child.length && isApiNode(ns.child[0]) ? ns.child?.map(mapApiToNodeItem) : undefined,
      apisResolved: true,
    });
  }
  return node;
}

function mapApiToNodeItem(api: PolyAPI.Api): NodeItem<PolyAPI.Api> {
  return {
    id: api.id,
    title: api.title,
    type: 'leaf',
    source: api,
    parentID: api.parent,
    iconName: 'api',
  };
}

class ApiDocStore {
  fetchDataModelDisposer: IReactionDisposer

  constructor() {
    this.fetchDataModelDisposer = reaction(() => this.tableID, this.fetchSchema);
  }

  @observable appID = '';
  @observable tableID = '';
  @observable dataModels: DataModel[] = [];
  @observable tempDataModels: DataModel[] = [];
  @observable currentDataModel: NavItemData = INIT_CURRENT_MODEL;
  @observable APiContent: APiContent = INIT_API_CONTENT;
  @observable dataModelSchema: DataModelSchema = INIT_MODEL_SCHEMA;
  @observable isAPILoading = true;
  @observable isAPITabLoading = true;
  @observable useFieldsID = false;
  @observable ApiPath = '';
  @observable defaultActiveKey = 'pageForm'
  @observable docType: DocType = 'curl';
  @observable params: DataModelsParameter = {}
  @observable apiNsList: PolyAPI.Namespace[] = []

  @computed get fields(): ModelField[] {
    return Object.entries(this.dataModelSchema.schema.properties || {}).map(([key, fieldSchema]) => {
      return {
        id: key,
        ...fieldSchema,
      };
    }).sort((a, b) => {
      return (b['x-index'] || 0) - (a['x-index'] || 0);
    });
  }

  @action
  fetchDataModels = (): void => {
    if (!this.appID) {
      return;
    }

    fetchDataModels(this.appID, this.params).then((res) => {
      const { list = [] } = res || {};
      this.dataModels = list;
      this.tempDataModels = deepClone(this.dataModels);
      this.changeKeyword('');
    }).catch((err) => {
      toast.error(err);
    });
  }

  @action
  changeKeyword = (keyword: string): void => {
    this.dataModels = !keyword ? deepClone(this.tempDataModels) :
      this.tempDataModels.filter(({ title }: DataModel) =>
        title?.match(keyword));
    this.currentDataModel = this.dataModels[0] || INIT_CURRENT_MODEL;
    this.tableID = this.dataModels[0]?.tableID;
    this.defaultActiveKey = this.currentDataModel.source === 1 ? 'pageForm' : 'dataModel';
  }

  @action
  fetchSchema = (tableID: string): void => {
    if (!tableID) return;
    this.isAPITabLoading = true;
    getTableSchema(this.appID, tableID).then((res: any) => {
      this.isAPITabLoading = false;
      this.dataModelSchema = { ...res, table_id: res.tableID };
    }).catch((err) => {
      this.isAPITabLoading = false;
      toast.error(err);
    });
  }

  @action
  fetchXName = (apiType: ApiType): void => {
    this.isAPILoading = true;
    getTableXName(this.appID, {
      tableID: this.tableID,
      action: apiType,
    }).then((res: {name: string}) => {
      this.ApiPath = res.name;
      this.isAPILoading = false;
    }).catch((err) => toast.error(err));
  }

  @action
  fetchApiDoc = (docType: DocType, titleFirst: boolean): void => {
    this.isAPILoading = true;
    if (this.ApiPath) {
      getApiDoc(this.ApiPath, {
        docType,
        titleFirst,
      }).then((res: QueryDocRes) => {
        const { doc } = res || {};
        this.APiContent = doc;
      }).catch((err: string) => {
        toast.error(err);
        this.APiContent = INIT_API_CONTENT;
      }).finally(()=> {
        this.isAPILoading = false;
      });
    }
  }

  @action
  fetchApiNamespaces=async ()=> {
    try {
      const { appPath } = await getAppPath(this.appID);
      const { list } = await getNamespaceList(appPath, { page: 1, pageSize: -1 });
      this.setNsList(list);
    } catch (err) {
      toast.error(err);
    }
  }

  @action
  setNsList=(list: PolyAPI.Namespace[])=> {
    this.apiNsList = list;
  }

  @action
  fetchSubNamespaces=async (parent: NodeItem<PolyAPI.Namespace>): Promise<void> => {
    const ns = [parent.parentID, parent.source?.name].join('/');
    try {
      const { list = [] } = await getNamespaceList(ns, { page: 1, pageSize: -1 });
      const target = treeFind(this.apiNsList as any, parent.id);
      Object.assign(target, { child: list });
      this.apiNsList = [...this.apiNsList];
    } catch (err) {
      toast.error(err);
    }
  }

  @action
  fetchNsApis=async (parent: NodeItem<PolyAPI.Namespace>): Promise<void> => {
    const name = parent.source?.name || '';
    const svc = [parent.parentID, name, name].join('/');
    try {
      const { list } = await getServiceApiList(svc, { page: 1, pageSize: -1 });
      const target = treeFind(this.apiNsList as any, parent.id);
      Object.assign(target, { child: list });
      this.apiNsList = [...this.apiNsList];
    } catch (err) {
      toast.error(err);
    }
  }

  @action
  setApiPath=(path: string)=> {
    this.ApiPath = path;
  }

  @action
  reset=()=> {
    this.tableID = '';
    this.apiNsList = [];
  }
}

export default new ApiDocStore();

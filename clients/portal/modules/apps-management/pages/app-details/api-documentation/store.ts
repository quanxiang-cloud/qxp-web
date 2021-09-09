import { action, computed, IReactionDisposer, observable, reaction } from 'mobx';

import toast from '@lib/toast';
import { getTableSchema } from '@lib/http-client';

import { fetchDataModels } from '../api';
import { INIT_MODEL_SCHEMA } from './constants';
import { getTableXName, getApiDoc } from './api';
import { INIT_API_CONTENT, INIT_CURRENT_MODEL } from './constants';

class ApiDocStore {
  fetchDataModelDisposer: IReactionDisposer

  constructor() {
    this.fetchDataModelDisposer = reaction(() => this.tableID, this.fetchSchema);
  }

  @observable appID = '';
  @observable tableID = '';
  @observable dataModels: DataModel[] = [];
  @observable currentDataModel: DataModel = INIT_CURRENT_MODEL;
  @observable APiContent: APiContent = INIT_API_CONTENT;
  @observable dataModelSchema: DataModelSchema = INIT_MODEL_SCHEMA;
  @observable isAPILoading = true;
  @observable isAPITabLoading = true;
  @observable useFieldsID = false;
  @observable ApiPath = '';
  @observable docType: DocType = 'curl';
  @observable params: DataModelsParameter = {}

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
      this.currentDataModel = this.dataModels[0] || INIT_CURRENT_MODEL;
      this.tableID = list[0]?.tableID;
    }).catch((err) => {
      toast.error(err);
    });
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
      this.fetchApiDoc();
    });
  }

  @action
  fetchApiDoc = (): void => {
    getApiDoc(this.ApiPath, {
      docType: this.docType,
      titleFirst: this.useFieldsID,
    }).then((res: QueryDocRes) => {
      const { doc } = res || {};
      this.APiContent = doc;
      this.isAPILoading = false;
    }).catch((err: string) => {
      toast.error(err);
      this.APiContent = INIT_API_CONTENT;
      this.isAPILoading = false;
    });
  }
}

export default new ApiDocStore();

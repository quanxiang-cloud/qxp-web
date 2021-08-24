import { action, observable, reaction, IReactionDisposer, computed } from 'mobx';
import { omit, set, unset } from 'lodash';

import toast from '@lib/toast';
import { getTableSchema } from '@lib/http-client';
import schemaToFields from '@lib/schema-convert';

import { deleteSchema, saveTableSchema } from './api';
import { fetchDataModels } from '../api';
import { INIT_MODEL_SCHEMA } from '../utils';

class AppModelStore {
  fetchDataModelDisposer: IReactionDisposer
  constructor() {
    this.fetchDataModelDisposer = reaction(() => this.params, this.fetchDataModels);
    reaction(() => this.curDataModel, this.fetchSchema);
  }

  @observable appID = '';
  @observable dataModels: DataModel[] = [];
  @observable modelModalType = '';
  @observable curDataModel = '';
  @observable dataModelsLoading = true;
  @observable modelDetailsLoading = false;
  @observable dataModelTotal = 0;
  @observable dataModelSchema: DataModelSchema = INIT_MODEL_SCHEMA;
  @observable params: DataModelParams = {
    page: 1,
    size: 10,
    title: '',
  }

  @computed get fields(): ModelField[] {
    return schemaToFields(this.dataModelSchema.schema).sort((a, b) => {
      return (b['x-index'] || 0) - (a['x-index'] || 0);
    }) as ModelField[];
  }

  @computed get basicInfo(): DataModelBasicInfo {
    return {
      title: this.dataModelSchema.schema.title as string,
      tableID: this.dataModelSchema.tableID,
      description: this.dataModelSchema.schema.description,
    };
  }

  @computed get existingFields(): string[] {
    return this.fields.map(({ id }) => id);
  }

  @action
  setParams = (newParams: Partial<DataModelParams>): void => {
    this.params = { ...this.params, ...newParams };
  }

  @action
  fetchDataModels = (): void => {
    if (!this.appID) {
      return;
    }

    this.dataModelsLoading = true;
    fetchDataModels(this.appID, this.params).then((res) => {
      const { total = 0, list = [] } = res || {};
      this.dataModelTotal = total;
      this.dataModels = list;
      this.dataModelsLoading = false;
    }).catch((err) => {
      this.dataModelsLoading = false;
      toast.error(err);
    });
  }

  @action
  saveDataModel = (basicInfo: DataModelBasicInfo): Promise<boolean> => {
    if (!this.dataModelSchema) {
      return Promise.resolve(false);
    }

    return saveTableSchema(
      this.appID,
      basicInfo.tableID,
      { ...this.dataModelSchema.schema, ...omit(basicInfo, 'tableID') },
      2,
    ).then(() => {
      this.setParams({});
      toast.success('添加成功！');
      return true;
    }).catch((err) => {
      toast.error(err);
      return false;
    });
  }

  @action
  delDataModel = (modelID: string): void => {
    deleteSchema(this.appID, modelID).then(() => {
      toast.success('删除成功');
      this.dataModels = this.dataModels.filter(({ tableID }) => tableID !== modelID);
    }).catch((err) => {
      toast.error(err);
    });
  }

  @action
  fetchSchema = (modelID: string): void => {
    if (!modelID) {
      return;
    }

    this.modelDetailsLoading = true;
    getTableSchema(this.appID, modelID).then((res: any) => {
      this.dataModelSchema = { ...res, tableID: res.tableID };
      this.modelDetailsLoading = false;
    }).catch((err) => {
      this.modelDetailsLoading = false;
      toast.error(err);
    });
  }

  @action
  dataModelModalControl = (modalType: 'details' | 'edit' | '', modelID = ''): void => {
    this.curDataModel = modalType ? modelID : '';
    this.modelModalType = modalType;
    if (!modalType) {
      this.dataModelSchema = INIT_MODEL_SCHEMA;
    }
  }

  @action
  addModelField = (field: ModelField): void => {
    this.dataModelSchema.schema.properties;
    this.dataModelSchema = set(
      this.dataModelSchema,
      `schema.properties.${field.id}`,
      { ...field, 'x-index': this.fields.length },
    );
  }

  @action
  delModelField = (fieldID: string): void => {
    unset(this.dataModelSchema, `schema.properties.${fieldID}`);
  }
}

export default new AppModelStore();

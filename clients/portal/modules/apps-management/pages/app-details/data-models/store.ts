import { action, observable, reaction, IReactionDisposer, computed } from 'mobx';
import { omit, set, unset } from 'lodash';

import toast from '@lib/toast';
import { getTableSchema, saveTableSchema } from '@lib/http-client';

import { fetchDataModels, deleteSchema } from './api';
import { SYSTEM_FIELDS } from './utils';

const INIT_MODEL_SCHEMA = {
  table_id: '',
  schema: {
    properties: SYSTEM_FIELDS,
    title: '',
    type: 'object',
    descpition: '',
  },
};

class AppModelStore {
  fetchDataModelDisposer: IReactionDisposer
  constructor() {
    this.fetchDataModelDisposer = reaction(() => this.params, this.fetchDataModels);
    reaction(() => this.curDataModel, this.fetchSchema);
  }

  @observable appID = '';
  @observable dataModels: DataModel[] = [];
  @observable editorDataModalVisible = false;
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
    return Object.entries(this.dataModelSchema.schema.properties || {}).map(([key, fieldSchema]) => {
      return {
        id: key,
        ...fieldSchema,
      };
    }).sort((a, b) => {
      return (b['x-index'] || 0) - (a['x-index'] || 0);
    });
  }

  @computed get basicInfo(): DataModelBasicInfo {
    return {
      title: this.dataModelSchema.schema.title as string,
      table_id: this.dataModelSchema.table_id,
      descpition: this.dataModelSchema.schema.descpition,
    };
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
      basicInfo.table_id,
      { ...this.dataModelSchema.schema, ...omit(basicInfo, 'table_id') },
      2,
    ).then((res) => {
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
      this.dataModels = this.dataModels.filter(({ id }) => id !== modelID);
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
      this.dataModelSchema = { ...res, table_id: res.tableID };
      this.modelDetailsLoading = false;
    }).catch((err) => {
      this.modelDetailsLoading = false;
      toast.error(err);
    });
  }

  @action
  dataModelModalControl = (visible: boolean, modelID = ''): void => {
    this.curDataModel = visible ? modelID : '';
    this.editorDataModalVisible = visible;
    if (!visible) {
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

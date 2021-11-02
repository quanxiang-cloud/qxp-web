import { action, observable, reaction, IReactionDisposer, computed, toJS } from 'mobx';
import { isEqual, omit, set, unset } from 'lodash';

import toast from '@lib/toast';
import { getTableSchema } from '@lib/http-client';
import schemaToFields from '@lib/schema-convert';

import { deleteSchema, modelDuplicate, saveTableSchema } from './api';
import { fetchDataModels } from '../api';
import { INIT_MODEL_SCHEMA } from '../utils';

class AppModelStore {
  fetchDataModelDisposer: IReactionDisposer
  constructor() {
    this.fetchDataModelDisposer = reaction(() => {
      return { params: this.params, appID: this.appID };
    }, this.fetchDataModels);
    reaction(() => this.curDataModel?.tableID, this.fetchSchema);
  }

  @observable appID = '';
  @observable dataModels: DataModel[] = [];
  @observable curModelTableID = '';
  @observable curDataModel: DataModel | null = null;
  @observable dataModelsLoading = false;
  @observable modelDetailsLoading = false;
  @observable dataModelTotal = 0;
  @observable dataModelSchema: DataModelSchema = INIT_MODEL_SCHEMA;
  @observable params: DataModelParams = {
    page: 1,
    size: 10000,
    title: '',
  }
  @observable editModalType = '';
  @observable searchModelInput = '';
  @observable searchModelFieldInput = '';

  @computed get fields(): ModelField[] {
    let fieldList = [];
    if (this.curDataModel?.source === 1) {
      fieldList = schemaToFields(toJS(this.dataModelSchema.schema)) as ModelField[];
    } else {
      fieldList = Object.entries(this.dataModelSchema.schema.properties || {}).map(([key, fieldSchema]) => {
        return {
          id: key,
          ...fieldSchema,
        };
      }).sort((a, b) => {
        return (b['x-index'] || 0) - (a['x-index'] || 0);
      });
    }

    return fieldList.filter(({ id, title }) => {
      if (!this.searchModelFieldInput) {
        return true;
      }

      return !!id.match(this.searchModelFieldInput) || !!(title as string).match(this.searchModelFieldInput);
    });
  }

  @computed get basicInfo(): DataModelBasicInfo {
    return {
      title: this.dataModelSchema.schema.title as string,
      tableID: this.dataModelSchema.tableID,
      description: this.dataModelSchema.schema.description,
    };
  }

  @computed get dataModelList(): DataModel[] {
    return this.dataModels.filter(({ title }) => {
      if (!this.searchModelInput) {
        return true;
      }

      return !!title.match(this.searchModelInput);
    });
  }

  @computed get existingFields(): string[] {
    return this.fields.map(({ id }) => id);
  }

  @action
  setEditModalType = (type: string): void => {
    this.editModalType = type;
  }

  @action
  setSearchModelFieldInput = (input: string): void => {
    this.searchModelFieldInput = input;
  }

  @action
  setSearchModelInput = (input: string): void => {
    this.searchModelInput = input;
  }

  @action
  setParams = (newParams: Partial<DataModelParams>): void => {
    this.params = { ...this.params, ...newParams };
  }

  @action
  setCurDataModal = (modal: DataModel): void => {
    this.curDataModel = modal;
    this.curModelTableID = modal.tableID;
  }

  @action
  updateDataModels = (models: DataModel[]): void => {
    this.dataModels = [...models];
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
  saveDataModel = (basicInfo: DataModelBasicInfo, modalType: string): Promise<boolean | void> => {
    if (!this.dataModelSchema) {
      return Promise.resolve(false);
    }

    if (modalType === 'copy') {
      return modelDuplicate(
        this.appID,
        this.curDataModel?.tableID || '',
        basicInfo.tableID,
        basicInfo.title,
        basicInfo.description || '',
      ).then(() => {
        toast.success('复制成功');
        this.setParams({});
        this.curModelTableID = basicInfo.tableID;
      }).catch((err) => {
        toast.error(err);
      });
    }

    return saveTableSchema(
      this.appID,
      basicInfo.tableID,
      { ...this.dataModelSchema.schema, ...omit(basicInfo, 'tableID') },
      2,
    ).then(() => {
      this.setParams({});
      this.curModelTableID = basicInfo.tableID;

      if (modalType === 'create') {
        toast.success('添加成功！');
      }

      if (modalType === 'edit') {
        toast.success('修改成功！');
      }

      if (modalType === 'delete') {
        toast.success('字段删除成功！');
      }

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
      const models = [...this.dataModels];
      this.dataModels = models.filter(({ tableID }, index) => {
        if (tableID !== modelID) {
          return true;
        }

        const nextModelIndex = isEqual(index, this.dataModels.length - 1) ? 0 : index + 1;
        this.curDataModel = this.dataModels[nextModelIndex];
        return false;
      });
    }).catch((err) => {
      toast.error(err);
    });
  }

  @action
  fetchSchema = (modelID?: string): void => {
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
  initDataModelSchema = (): void => {
    this.dataModelSchema = INIT_MODEL_SCHEMA;
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

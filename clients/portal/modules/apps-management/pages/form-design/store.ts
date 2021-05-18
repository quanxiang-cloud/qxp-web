import { action, observable, reaction, IReactionDisposer, computed } from 'mobx';
import { UnionColumns } from 'react-table';

import FormStore from '@c/form-builder/store';
import toast from '@lib/toast';
import {
  createFormScheme,
  fetchFormScheme,
  updateFormScheme,
  createPageScheme,
  createPerGroup,
  fetchRights,
  deleteRights,
  movePerGroup,
  updatePerGroup,
} from './api';
import appPageDataStore from '@c/app-page-data/store';
import { PageTableShowRule, Scheme, setFixedParameters } from '@c/app-page-data/utils';

import { getFilterField, getAttribute } from './utils';

class FormDesignStore {
  destroyFetchScheme: IReactionDisposer;
  destroySetTableColumn: IReactionDisposer;
  destroySetTableConfig: IReactionDisposer;
  destroySetFiltrates: IReactionDisposer;
  destroySetAllFiltrate: IReactionDisposer;
  @observable pageID = '';
  @observable appID = '';
  @observable saveSchemeLoading = false;
  @observable initScheme = {};
  @observable pageLoading = true;
  @observable formStore: FormStore | null = null;
  @observable hasSchema = false;
  @observable pageTableConfig: Record<string, any> = {};
  @observable pageTableShowRule: PageTableShowRule = {};
  @observable rightsList: Rights[] = [];
  @observable allFiltrate: PageField[] = [];
  @observable rightsLoading = false;

  @computed get fieldList(): PageField[] {
    const fieldsMap: any = this.formStore?.schema?.properties || {};
    return Object.keys(fieldsMap).filter((_key: string) => {
      return _key !== '_id';
    }).map((key: string) => {
      return {
        id: key,
        label: fieldsMap[key].title || '',
        type: fieldsMap[key].type,
        enum: fieldsMap[key].enum,
        isSystem: fieldsMap[key]['x-internal'].isSystem ? true : false,
        cProps: fieldsMap[key]['x-component-props'],
        ...getAttribute(this.pageTableConfig[key], fieldsMap[key]['x-index']),
      };
    });
  }

  constructor() {
    this.destroyFetchScheme = reaction(() => {
      return { pageID: this.pageID, appID: this.appID };
    }, this.fetchFormScheme);

    this.destroySetAllFiltrate = reaction(() => this.fieldList.length, () => {
      if (!this.formStore) {
        return;
      }
      this.allFiltrate = this.allFiltrate.filter(({ id }) => {
        if (!this.formStore?.schema?.properties) {
          return false;
        }

        return id in this.formStore?.schema?.properties;
      });
    });

    this.destroySetFiltrates = reaction(() => {
      return this.allFiltrate.map((field: PageField) => {
        return getFilterField(field);
      });
    }, appPageDataStore.setFiltrates);

    this.destroySetTableColumn = reaction(() => {
      const column: UnionColumns<any>[] = [];
      [...this.fieldList].sort((a: PageField, b: PageField) => {
        return a.sort - b.sort;
      }).forEach((field) => {
        if (field.visible) {
          column.push({
            id: field.id,
            Header: field.label,
            accessor: field.id,
          });
        }
      });

      return setFixedParameters(this.pageTableShowRule.fixedRule, column);
    }, appPageDataStore.setTableColumns);

    this.destroySetTableConfig = reaction(() => {
      return this.pageTableShowRule;
    }, appPageDataStore.setTableConfig);
  }

  @action
  setFilterList = (filtrates: PageField[]) => {
    this.allFiltrate = filtrates;
  }

  @action
  addRight = (rights: RightsCreate) => {
    const _rights = {
      ...rights,
      sequence: this.rightsList.length,
      formID: this.pageID,
      appID: this.appID,
    };
    return createPerGroup(this.appID, _rights).then((res) => {
      this.rightsList = [...this.rightsList, { ..._rights, ...res.data }];
    });
  }

  @action
  deleteRight = (id: string) => {
    const delAfter = this.rightsList.filter((rights) => id !== rights.id);
    deleteRights(this.appID, {
      id, moveArr: delAfter.map((AFrights, sequence) => {
        return { id: AFrights.id, sequence };
      }),
    }).then(() => {
      toast.success('删除成功!');
      this.rightsList = delAfter;
    });
  }

  @action
  setPageID = (pageID: string) => {
    this.pageID = pageID;
  }

  @action
  setAppID = (appID: string) => {
    this.appID = appID;
    appPageDataStore.setAppID(appID);
  }

  @action
  setAllPageTableConfig = (values: Scheme[]) => {
    values.forEach((value) => {
      this.pageTableConfig[value.id] = { ...this.pageTableConfig[value.id], ...value };
    });
  }

  @action
  setPageTableShowRule = (newRule: PageTableShowRule) => {
    this.pageTableShowRule = { ...this.pageTableShowRule, ...newRule };
  }

  @action
  setPageTableConfig = (key: string, newConfig: Scheme) => {
    const _config = { [key]: { ...this.pageTableConfig[key], ...newConfig } };
    this.pageTableConfig = { ...this.pageTableConfig, ..._config };
  }

  @action
  reSetFormScheme = () => {
    this.formStore = new FormStore({ schema: this.initScheme });
  }

  @action
  fetchFormScheme = ({ pageID, appID }: { pageID: string, appID: string}) => {
    if (!pageID || !appID) {
      return;
    }

    this.pageLoading = true;
    fetchFormScheme(appID, pageID).then((res) => {
      const { schema = {}, config } = res.data || {};
      this.hasSchema = res.data ? true : false;
      this.initScheme = schema;
      this.formStore = new FormStore({ schema });
      if (config) {
        this.pageTableConfig = config.pageTableConfig || {};
        this.allFiltrate = config.filtrate || [];
        this.pageTableShowRule = config.pageTableShowRule || {};
      }
      this.pageLoading = false;
    }).catch(() => {
      this.pageLoading = false;
    });
  }

  @action
  saveFormScheme = () => {
    this.saveSchemeLoading = true;
    return (this.hasSchema ? updateFormScheme : createFormScheme)(this.appID, {
      schema: this.formStore?.schema,
      tableID: this.pageID,
    }).then(() => {
      (this.formStore as FormStore).hasEdit = false;
      toast.success(this.hasSchema ? '保存成功!' : '创建成功!');
      this.saveSchemeLoading = false;
    }).catch(() => {
      this.saveSchemeLoading = false;
    });
  }

  @action
  clear = () => {
    this.pageID = '';
    this.formStore = null;
    this.pageTableConfig = {};
    this.pageTableShowRule = {};
    this.allFiltrate = [];
    appPageDataStore.clear();
  }

  @action
  savePageConfig = () => {
    createPageScheme(this.appID, {
      tableID: this.pageID, config: {
        pageTableConfig: this.pageTableConfig,
        filtrate: this.allFiltrate,
        pageTableShowRule: this.pageTableShowRule,
      },
    }).then(() => {
      toast.success('保存成功!');
    });
  }

  @action
  fetchRights = () => {
    this.rightsLoading = true;
    fetchRights(this.appID, this.pageID).then((res) => {
      this.rightsList = res.data.list;
      this.rightsLoading = false;
    }).catch(() => {
      this.rightsLoading = false;
    });
  }

  @action
  updatePerGroup = (rights: Rights) => {
    return updatePerGroup(this.appID, rights).then(() => {
      this.rightsList = this.rightsList.map((_rights) => {
        if (rights.id === _rights.id) {
          return { ..._rights, ...rights };
        }
        return _rights;
      });
      toast.success('修改成功！');
      return true;
    });
  }

  @action
  rightsGroupSort = (rightsIdList: string[]) => {
    const newRightsList: Rights[] = [];
    movePerGroup(this.appID, {
      moveArr: rightsIdList.map((id, index) => {
        const rights = this.rightsList.find((_rights) => _rights.id === id);
        if (rights) {
          newRightsList.push({
            ...rights,
            sequence: index,
          });
        }
        return {
          id,
          sequence: index,
        };
      }),
    });
    this.rightsList = newRightsList;
  }
}

export default new FormDesignStore();

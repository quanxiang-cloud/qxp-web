import { action, observable, reaction, IReactionDisposer, computed } from 'mobx';

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
} from '@appLib/api';
import appPageDataStore from '@appC/app-page-data/store';

import { getFilterField, getAttribute } from './utils';

class FormDesignStore {
  destroyFetchScheme: IReactionDisposer;
  destroySetTableColumn: IReactionDisposer;
  destroySetTableConfig: IReactionDisposer;
  destroySetFiltrates: IReactionDisposer;
  @observable pageID = '';
  @observable pageLoading = true;
  @observable formStore: any = null;
  @observable formMetadata: any = {};
  @observable pageTableConfig: any = {};
  @observable pageTableShowRule: any = {};
  @observable rightsList: Rights[] = [];
  @observable allFiltrate: PageField[] = [];
  @observable rightsLoading = false;

  @computed get fieldList(): PageField[] {
    const fieldsMap = this.formStore?.schema?.properties || {};
    return Object.keys(fieldsMap).map((key: string, index: number) => {
      return {
        id: key,
        label: fieldsMap[key].title || '',
        type: fieldsMap[key].type,
        enum: fieldsMap[key].enum,
        isSystem: !fieldsMap[key].display,
        cProps: fieldsMap[key]['x-component-props'],
        ...getAttribute(this.pageTableConfig[key], index),
      };
    });
  }

  constructor() {
    this.destroyFetchScheme = reaction(() => this.pageID, this.fetchFormScheme);

    this.destroySetFiltrates = reaction(() => {
      const filtrates: FilterField[] = [];

      this.allFiltrate.forEach((field: PageField) => {
        if (this.fieldList.findIndex(({ id }: PageField) => field.id === id) === -1) {
          return;
        }
        filtrates.push(getFilterField(field));
      });

      return filtrates;
    }, appPageDataStore.setFiltrates);

    this.destroySetTableColumn = reaction(() => {
      const column: any[] = [];
      let recordColNum = 0;
      let fixedColumnIndex: number[] = [];
      switch (this.pageTableShowRule.fixedRule) {
      case 'one':
        fixedColumnIndex = [0];
        break;
      case 'previous_two':
        fixedColumnIndex = [0, 1];
        break;
      }

      [...this.fieldList].sort((a: PageField, b: PageField) => {
        return a.sort - b.sort;
      }).forEach((field) => {
        if (field.visible) {
          column.push({
            id: field.id,
            Header: field.label,
            accessor: field.id,
            fixed: fixedColumnIndex.includes(recordColNum),
          });
          recordColNum += 1;
        }
      });
      return column;
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
    };
    return createPerGroup(_rights).then((res) => {
      this.rightsList = [...this.rightsList, { ..._rights, ...res.data }];
    });
  }

  @action
  deleteRight = (id: string) => {
    const delAfter = this.rightsList.filter((rights) => id !== rights.id);
    deleteRights({ id, moveArr: delAfter.map((AFrights, sequence) => {
      return { id: AFrights.id, sequence };
    }) }).then(() => {
      toast.success('删除成功!');
      this.rightsList = delAfter;
    });
  }

  @action
  setPageID = (pageID: string) => {
    this.pageID = pageID;
  }

  @action
  setAllPageTableConfig = (values: any[]) => {
    values.forEach((value) => {
      this.pageTableConfig[value.id] = { ...this.pageTableConfig[value.id], ...value };
    });
  }

  @action
  setPageTableShowRule = (newRule: any) => {
    this.pageTableShowRule = { ...this.pageTableShowRule, ...newRule };
  }

  @action
  setPageTableConfig = (key: string, newConfig: any) => {
    const _config = { [key]: { ...this.pageTableConfig[key], ...newConfig } };
    this.pageTableConfig = { ...this.pageTableConfig, ..._config };
  }

  @action
  fetchFormScheme = (pageID: string) => {
    if (!pageID) {
      return;
    }

    this.pageLoading = true;
    fetchFormScheme(pageID).then((res) => {
      const { schema = {}, config, ...others } = res.data || {};
      this.formStore = new FormStore({ schema });
      this.formMetadata = others;
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
  createFormScheme = () => {
    createFormScheme({ tableID: this.pageID, schema: this.formStore.schema }).then(() => {
      toast.success('创建成功!');
    });
  }

  @action
  updateFormScheme = () => {
    updateFormScheme({
      id: this.formMetadata.id,
      schema: this.formStore.schema,
      tableID: this.pageID,
    }).then(() => {
      toast.success('保存成功!');
    });
  }

  @action
  clear = () => {
    this.pageID = '';
    this.formStore = null;
  }

  @action
  savePageConfig = () => {
    createPageScheme({
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
    fetchRights(this.pageID).then((res) => {
      this.rightsList = res.data.list;
      this.rightsLoading = false;
    }).catch(() => {
      this.rightsLoading = false;
    });
  }

  @action
  updatePerGroup = (rights:Rights) => {
    return updatePerGroup(rights).then(()=>{
      this.rightsList = this.rightsList.map((_rights)=>{
        if (rights.id===_rights.id) {
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
    movePerGroup({
      moveArr: rightsIdList.map((id, index) => {
        const rights = this.rightsList.find((_rights) => _rights.id===id);
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

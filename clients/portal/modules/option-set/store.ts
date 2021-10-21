import { observable, action, computed, toJS, reaction } from 'mobx';
import { get, set, cloneDeep, isEqual, uniq } from 'lodash';

import toast from '@lib/toast';
import { generateRandomFormFieldID as genId } from '@c/form-builder/utils';
import * as apis from './api';

class OptionSetStore {
  @observable optionSetNames: OptionSet[] = [];
  @observable search = '';
  @observable loadingNames = false;
  @observable loadingOptionSet = false;
  @observable activeId = '';
  @observable activeOptionSet: OptionSet | null = null;
  @observable tree: OptionSetTreeItem[] = [];
  @observable list: OptionSetListItem[] = [];
  @observable modalOpen = false;
  @observable path = '';
  @observable modalType = 'add';
  @observable queryID = '';
  @observable queryType = 'tree';
  @observable showNoData = false;

  constructor() {
    reaction(() => this.dataList, this.setTreeList);
  }

  @computed get dataList(): OptionSetTreeItem[] | OptionSetListItem[] {
    const optionSet = toJS(this.activeOptionSet);
    if (!optionSet) {
      return [];
    }
    let dataList;

    try {
      dataList = JSON.parse(optionSet.content || '[]');
    } catch (err) {
      dataList = [];
    }

    return dataList;
  }

  @action
  setTreeList = (dataList: OptionSetTreeItem[] | OptionSetListItem[]): void => {
    this.tree = dataList;
    this.list = dataList;
  }

  @action
  fetchAllNames = async (params?: OptionSets): Promise<void> => {
    this.loadingNames = true;
    try {
      const { list } = await apis.getOptionSetNames(params);
      this.optionSetNames = list;
    } catch (err: any) {
      toast.error(err.message);
    }
    this.loadingNames = false;
    this.setActive(this.queryID, this.queryType);
    this.showNoData = true;
  };

  LEVEL = ['[0].children[0].children[0]', '[0].children[0]', '[0]'];
  getDefaultPrefix = (): string => {
    const idx = this.LEVEL.findIndex((prefix) => get(this.tree, prefix) !== undefined);
    return idx === -1 ? '' : this.LEVEL[idx];
  }

  @action
  fetchOptionSet = async (id: string): Promise<void> => {
    if (!id) {
      this.activeOptionSet = null;
      return;
    }
    this.loadingOptionSet = true;
    try {
      this.activeOptionSet = await apis.getOptionSetById(id);
    } catch (err: any) {
      toast.error(err.message);
    }
    this.loadingOptionSet = false;
    this.path = this.getDefaultPrefix();
  }

  @action
  setNames = (names: OptionSet[]): void => {
    this.optionSetNames = names;
  };

  @action
  setSearch = (word: string): void => {
    this.search = word;
  };

  @action
  setActive = (id: string, type?: string): void => {
    if (!id && this.optionSetNames.length) {
      const apiType = type === 'tree' ? 2 : 1;
      const activeIdIdx = this.optionSetNames.findIndex((itm) => itm.type === apiType);
      this.activeId = this.optionSetNames[activeIdIdx]?.id || '';
    } else {
      this.activeId = id;
    }
  }

  @action
  setActiveOptionSet = (optionSet: OptionSet | null): void => {
    this.activeOptionSet = optionSet;
  }

  handleSaveTree = (tree: OptionSetTreeItem[]): void => {
    const validate = (): boolean => {
      // validate
      // 1.label must filled
      let valid = true;
      const checkItem = ({ label, value, children }: OptionSetTreeItem): void => {
        if (!label || !value) {
          valid = false;
          return;
        }
        if (children?.length) {
          children.forEach(checkItem);
        }
      };
      tree.forEach(checkItem);

      if (!valid) {
        toast.error('label不能为空');
        return false;
      }
      return true;
    };

    if (!validate) {
      return;
    }

    const serializeCont = JSON.stringify(tree);
    if (serializeCont === JSON.stringify({ ...this.dataList })) {
      toast.error('数据未更改');
      return;
    }

    if (this.activeOptionSet) {
      apis.updateOptionSet({
        ...this.activeOptionSet,
        content: serializeCont,
      }).then((data) => {
        if (data) {
          toast.success('更新成功');
          if (this.activeOptionSet) {
            this.activeOptionSet.content = serializeCont;
          }
        } else {
          toast.error('更新失败');
        }
      }).catch((err: Error) => toast.error(err.message));
    }
  };

  @action
  addSubNode = (labels: string[], nodePath: string): void => {
    const bakTree = cloneDeep(toJS(this.tree));
    const path = `${nodePath}.children`;
    let cur = get(bakTree, path);
    if (!cur) {
      set(bakTree, path, []);
      cur = get(bakTree, path);
    }
    for (const label of labels) {
      if (label.length > 20) {
        toast.error('选项名称超过20个字');
        return;
      }
    }
    if (!nodePath) {
      const curTree: OptionSetTreeItem[] = [];
      const firstLabels = this.tree.map((itm) => itm.label);
      if (!isEqual(labels.concat(firstLabels), uniq(labels.concat(firstLabels)))) {
        toast.error('选项名称不可重复');
        return;
      }
      labels.map((itm: string) => {
        curTree.push({ label: itm, value: genId() });
      });

      this.tree = this.tree.concat(curTree);
      this.handleSaveTree(this.tree);
      return;
    }
    if (get(this.tree, nodePath)?.children) {
      const existLabel = get(this.tree, nodePath).children.map((itm: OptionSetTreeItem) => itm.label);
      if (!isEqual(existLabel.concat(labels), uniq(existLabel.concat(labels)))) {
        toast.error('选项名称不可重复');
        return;
      }
    }
    if (!isEqual(labels, uniq(labels))) {
      toast.error('选项名称不可重复');
      return;
    }
    labels.map((itm: string) => {
      cur.push({ label: itm, value: genId() });
    });

    this.tree = bakTree;
    this.handleSaveTree(bakTree);
  }

  @action
  removeItem = (path: string): void => {
    const bakTree = cloneDeep(this.tree);
    const bracketIdx = path.lastIndexOf('[');
    const lastIdx = parseInt(path.slice(bracketIdx + 1));
    const parentPath = path.slice(0, bracketIdx);
    const parent = parentPath ? get(bakTree, parentPath) : bakTree;
    // remove chosen item
    parent.splice(lastIdx, 1);

    this.tree = bakTree;
    this.handleSaveTree(bakTree);
  };

  @action
  removeAllItem = (path: string): void => {
    const bakTree = cloneDeep(this.tree);
    if (!path) {
      bakTree.splice(0, bakTree.length);
    } else set(bakTree, `${path}.children`, []);

    this.tree = bakTree;
    this.path = path;
    this.handleSaveTree(bakTree);
  };

  @action
  handleChangeField = (path: string, fieldKey: 'label' | 'value', val: string): void => {
    if (!val) {
      toast.error('选项集名称不可为空');
      return;
    }
    if (val.length > 20) {
      toast.error('选项名称超过20个字');
      return;
    }
    const bakTree = cloneDeep(this.tree);
    set(bakTree, path ? [path, fieldKey].join('.') : fieldKey, val);

    this.tree = bakTree;
    this.handleSaveTree(bakTree);
  };

  handleSaveList = (list: OptionSetListItem[]): void => {
    if (list.some((v) => !v.label || !v.value)) {
      toast.error('label不能为空');
      return;
    }

    const serializeCont = JSON.stringify(list);
    if (serializeCont === JSON.stringify([...this.dataList])) {
      toast.error('数据未更改');
      return;
    }

    if (this.activeOptionSet) {
      apis.updateOptionSet({
        ...this.activeOptionSet,
        content: serializeCont,
      }).then((data) => {
        if (data) {
          toast.success('更新成功');
          // update current content
          if (this.activeOptionSet) {
            this.activeOptionSet.content = serializeCont;
          }
        } else {
          toast.error('更新失败');
        }
      }).catch((err: Error) => toast.error(err.message));
    }
  };

  @action
  addListItem = (items: OptionSetListItem[]): void => {
    const labels = this.list.map(({ label }) => label);
    const itemLabels = items.map(({ label }) => label);
    if (labels.concat(itemLabels).length !== uniq(labels.concat(itemLabels)).length) {
      toast.error('label不能重复');
      return;
    }
    for (const item of itemLabels) {
      if (item.length > 20) {
        toast.error('选项名称超过20个字');
        return;
      }
    }

    this.list = this.list.concat(items);
    this.handleSaveList(this.list);
  };

  @action
  removeListItem = (idx: number): void => {
    this.list = this.list.filter((v, index) => index !== idx);
    this.handleSaveList(this.list);
  };

  @action
  handleChangeListField = (idx: number, fieldKey: 'label' | 'value', val: string): void => {
    if (!val) {
      toast.error('选项集名称不可为空');
      return;
    }
    if (val.length > 20) {
      toast.error('选项名称超过20个字');
      return;
    }
    const newStagingItems = this.list.map((v, index) => {
      if (index === idx) {
        return { ...v, [fieldKey]: val };
      }
      return v;
    });

    this.handleSaveList(newStagingItems);
  };

  @action
  reset = (): void => {
    this.search = '';
    this.optionSetNames = [];
    this.activeId = '';
    this.activeOptionSet = null;
    this.tree = [];
    this.list = [];
    this.modalOpen = false;
    this.path = '';
    this.showNoData = false;
  }
}

export default new OptionSetStore();

import toast from '@lib/toast';
import { action, observable, reaction } from 'mobx';
import { getGroupList, getGroups, Group } from './api';

export interface DataGroup {
  id: string;
  title: string;
  type: string;
}

function changeNavMenus(data: Array<Group>): Array<DataGroup> {
  return data?.map((group) => {
    return { ...group, title: group.name, type: 'leaf' };
  });
}
class GroupManagementStore {
  @observable groupNavMenus: DataGroup[] = [];
  @observable curGroupId = '';
  @observable loading = false;
  @observable total = 0;

  constructor() {
    reaction(() => this.groupNavMenus, () => {
      if (!this.groupNavMenus.find(({ id }) => id === this.curGroupId)) {
        this.setCurGroupId(this.groupNavMenus[0].id);
      }
    });
  }

  @action
  setCurGroupId = (id: string): void => {
    this.curGroupId = id;
  };

  @action
  setLoading = (loading: boolean): void => {
    this.loading = loading;
  };

  @action
  searchGroups = (name?: string): void => {
    getGroups(name || '').then(({ departments: data }) => {
      if (!data) {
        this.groupNavMenus = [];
        return;
      }

      this.groupNavMenus = changeNavMenus(data);
    }).catch((err) => toast.error(err)).finally(() => this.setLoading(false));
  };

  @action
  fetchGroupMenus = (): void => {
    getGroupList(1, 999).then(({ data }) => {
      if (!data) {
        this.groupNavMenus = [];
        return;
      }

      this.groupNavMenus = changeNavMenus(data);
    }).catch((err) => toast.error(err)).finally(() => this.setLoading(false));
  };

  @action
  validateTitleRepeat = (groupName: string): boolean => {
    return this.groupNavMenus.some((group) => group.title === groupName);
  };

  @action
  reset = (): void => {
    this.groupNavMenus = [];
    this.curGroupId = '';
  };
}

export default new GroupManagementStore();

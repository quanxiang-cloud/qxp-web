import toast from '@lib/toast';
import { action, observable } from 'mobx';

import { getAdminOrg, getUserList, searchUser } from './api';

const Limit = 50;
const qxpRootId = 'qxp-root-id';
const userGraphQL = '{users{id,email,name},total}';
const qxpRoot: Department = {
  name: '全部',
  id: qxpRootId,
  pid: qxpRootId,
  superID: '',
  grade: 1,
  attr: '',
};
const initOrg = { name: '', id: '', pid: '', superID: '', grade: 1, attr: '' };

class UserOrgPickerStore {
  @observable loading = false;
  @observable adminOrg: Department = initOrg;
  @observable curOrgList: Array<Department> = [];
  @observable branchPath: Array<Department> = [qxpRoot];
  @observable currentBranch: Department = qxpRoot;
  @observable userList: Array<UserApi.User> = [];
  @observable total = 0;
  @observable checkedUserList: Array<string> = [];
  @observable isSearch = false;

  @action setAdminOrg = (adminOrg: Department): void => {
    this.adminOrg = adminOrg;
  };

  @action setCurOrgList = (curOrgList: Array<Department>): void => {
    this.curOrgList = curOrgList;
  };

  @action setBranchPath = (branchPath: Array<Department>): void => {
    this.branchPath = branchPath;
  };

  @action setCurrentBranch = (currentBranch: Department): void => {
    this.currentBranch = currentBranch;
  };

  @action addSingleUserId = (checkedUserId: string): void => {
    this.checkedUserList.splice(0, 1, checkedUserId);
  };

  @action addUserId = (checkedUserId: string): void => {
    this.checkedUserList.push(checkedUserId);
  };

  @action removeUserId = (checkedUserId: string): void => {
    this.checkedUserList = this.checkedUserList.filter((userId) => userId !== checkedUserId);
  };

  @action setCheckedUserList = (checkedUserList: Array<string>): void => {
    this.checkedUserList = checkedUserList;
  };

  @action fetchUsers = (page: number): void => {
    if (!this.currentBranch?.id) return;
    if (this.currentBranch.id === qxpRootId) {
      this.curOrgList = [this.adminOrg];
      this.userList = [];
      return;
    }

    this.loading = true;
    getUserList(this.currentBranch.id, Limit, page).then(({ data, total_count }) => {
      this.userList = data;
      this.total = total_count;
    }).catch((err) => toast.error(err)).finally(() => this.loading = false);
  };

  @action fetchMoreUserList = (page: number, userName?: string): void => {
    getUserList(this.currentBranch.id, Limit, page, userName).then(({ data }) => {
      this.userList.push(...data);
    });
  };

  @action fetchAdminOrg = (): void => {
    this.reset();
    this.loading = true;
    getAdminOrg().then((res) => {
      this.setAdminOrg(res);
      this.setCurOrgList([res]);
    }).catch((err) => toast.error(err)).finally(() => this.loading = false);
  };

  @action searchUserList = (queryGraphQL: string | number, keyword: string): void => {
    if (!keyword) {
      this.curOrgList = [this.adminOrg];
      this.branchPath = [qxpRoot];
      this.currentBranch = qxpRoot;
      this.userList = [];
      this.isSearch = false;
      return;
    }
    this.isSearch = true;
    this.curOrgList = [];
    searchUser({ query: `{${queryGraphQL}${userGraphQL}}` }).then(({ total, users }) => {
      this.userList = users;
      this.total = total;
    }).catch((err) => toast.error(err));
  };

  @action changeCurOrg = (branch: Department, curOrgList?: Array<Department>): void => {
    this.userList = [];
    if (curOrgList?.length) {
      this.curOrgList = curOrgList;
    } else {
      this.curOrgList = [];
    }
    this.currentBranch = branch;
    if (this.branchPath.includes(branch)) {
      const index = this.branchPath.indexOf(branch);
      this.branchPath = this.branchPath.slice(0, index + 1);
    } else {
      this.branchPath.push(branch);
    }
  };

  @action reset = (): void => {
    this.adminOrg = initOrg;
    this.curOrgList = [];
    this.branchPath = [qxpRoot];
    this.currentBranch = qxpRoot;
    this.userList = [];
  };
}

export default new UserOrgPickerStore();

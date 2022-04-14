import { NodeItem } from '@c/two-level-menu';
import toast from '@lib/toast';
import { getQuery } from '@lib/utils';
import { action, computed, observable, reaction } from 'mobx';

import { copyRole, createRole, deleteRole, fetchRoles, updateRole } from '../api';
import { Role } from '../constants';

class RoleNavStore {
  @observable appID = '';
  @observable modalType = '';
  @observable searchRoleWords = '';
  @observable editLoading = false;
  @observable rolesList: RoleRight[] = [];
  @observable curRole: RoleRight | undefined = undefined;
  @observable fetchRoleLoading = false;

  constructor() {
    reaction(() => this.appID, this.fetchRoleList);
  }

  @computed get roles(): NodeItem<RoleRight>[] {
    if (this.rolesList.length) {
      let _rolesList = [];
      if (this.searchRoleWords) {
        _rolesList = this.rolesList.filter((role) => role.name?.match(this.searchRoleWords));
      } else {
        _rolesList = this.rolesList;
      }
      return _rolesList.map((role) => {
        return {
          id: role.id,
          title: role.name || '',
          type: 'leaf',
          iconName: 'people_alt',
          source: role,
        };
      });
    }
    return [];
  }

  @action
  setSearchRoleInput = (input: string): void => {
    this.searchRoleWords = input;
  };

  @action
  setAppID = (appID: string): void => {
    this.appID = appID;
  };

  @action
  setModalType = (modalType: string): void => {
    this.modalType = modalType;
  };

  @action
  fetchRoleList = (): void => {
    fetchRoles(this.appID)
      .then(this.setRoles)
      .catch((err) => toast.error(err));
  };

  @action
  setRoles = (rolesList: RoleRight[]): void => {
    this.rolesList = rolesList;
    const { id } = getQuery<{ id: string }>();
    if (!id) {
      this.curRole = this.rolesList?.[0] || undefined;
      return;
    }
    this.curRole = this.rolesList.find((role) => role.id === id) || undefined;
  };

  @action
  setCurRole = (curRole: RoleRight | undefined): void => {
    this.curRole = curRole;
  };

  @action
  addRole = (role: RoleCreate): Promise<void> => {
    this.editLoading = true;
    return createRole(this.appID, role)
      .then((res: { id: string }) => {
        this.rolesList = [...this.rolesList, { ...role, ...res, type: Role.CUSTOMIZE }];
        this.curRole = { ...role, ...res };
      })
      .catch((err) => toast.error(err))
      .finally(() => {
        this.modalType = '';
        this.editLoading = false;
      });
  };

  @action
  copyRole = (rights: RoleRight): void => {
    copyRole(this.appID, {
      groupID: rights.id,
      name: rights.name,
      description: rights.description,
    })
      .then((res: { id: string }) => {
        this.rolesList = [...this.rolesList, { ...this.curRole, ...rights, ...res }];
        this.curRole = { ...this.curRole, ...rights, ...res };
        toast.success('复制成功！');
      })
      .catch((err) => toast.error(err))
      .finally(() => {
        this.modalType = '';
        this.editLoading = false;
      });
  };

  @action
  updateRole = (rights: RoleRight): void | boolean => {
    updateRole(this.appID, rights)
      .then(() => {
        this.rolesList = this.rolesList.map((_rights) => {
          if (rights.id === _rights.id) {
            this.curRole = { ..._rights, ...rights };
            return { ..._rights, ...rights };
          }

          return _rights;
        });
        toast.success('修改成功！');
      })
      .catch((err) => toast.error(err))
      .finally(() => {
        this.modalType = '';
        this.editLoading = false;
      });
  };

  @action
  deleteRole = (id: string): void => {
    const delAfter = this.rolesList.filter((role) => id !== role.id);
    deleteRole(this.appID, id)
      .then(() => {
        this.rolesList = delAfter;
        toast.success(
          `${this.curRole?.name || ''}  角色删除成功`,
        );
        this.curRole = delAfter[0];
      })
      .catch((err) => toast.error(err))
      .finally(() => {
        this.modalType = '';
      });
  };

  @action
  clear = (): void => {
    this.appID = '';
    this.curRole = undefined;
  };
}

export default new RoleNavStore();

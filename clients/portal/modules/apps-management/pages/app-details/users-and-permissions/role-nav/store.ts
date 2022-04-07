import toast from '@lib/toast';
import { action, observable } from 'mobx';
import { copyRole, createRole, deleteRole, updateRole } from '../api';

class RoleNavStore {
  @observable appID = '';
  @observable modalType = '';
  @observable rolesList: RoleRight[] = [];
  @observable curRole: RoleRight = { id: '' };

  @action
  setAppID = (appID: string): void => {
    this.appID = appID;
  };

  @action
  setModalType = (modalType: string): void => {
    this.modalType = modalType;
  };

  @action
  setRolesList = (rolesList: RoleRight[]): void => {
    this.rolesList = rolesList;
  };

  @action
  setCurRole = (curRole: RoleRight): void => {
    this.curRole = curRole;
  };

  @action
  addRole = (role: RoleCreate): Promise<void> => {
    return createRole(this.appID, role)
      .then((res: { id: string }) => {
        this.rolesList = [...this.rolesList, { ...role, ...res }];
        this.curRole = { ...role, ...res };
      })
      .catch((err) => toast.error(err));
  };

  @action
  copyRole = (rights: RoleRight): Promise<void> => {
    return copyRole(this.appID, {
      groupID: rights.id,
      name: rights.name,
      description: rights.description,
    }).then((res: { id: string }) => {
      this.rolesList = [...this.rolesList, { ...this.curRole, ...rights, ...res }];
      this.curRole = { ...this.curRole, ...rights, ...res };
      toast.success('复制成功！');
    });
  };

  @action
  updateRole = (rights: RoleRight): Promise<void | boolean> => {
    return updateRole(this.appID, rights).then(() => {
      this.rolesList = this.rolesList.map((_rights) => {
        if (rights.id === _rights.id) {
          this.curRole = { ..._rights, ...rights };
          return { ..._rights, ...rights };
        }

        return _rights;
      });
      toast.success('修改成功！');
      return true;
    });
  };

  @action
  deleteRole = (id: string): void => {
    const delAfter = this.rolesList.filter((role) => id !== role.id);
    deleteRole(this.appID, id).then(() => {
      toast.success(
        `${this.curRole.name}  权限组删除成功`,
      );
      this.rolesList = delAfter;
      this.curRole = delAfter[0];
    });
  };
}

export default new RoleNavStore();

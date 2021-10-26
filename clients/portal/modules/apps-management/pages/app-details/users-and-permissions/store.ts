import { action, observable } from 'mobx';

import toast from '@lib/toast';
import { getTableSchema } from '@lib/http-client';
import schemaToFields from '@lib/schema-convert';

import {
  fetchRights,
  movePerGroup,
  updatePerGroup,
  createPerGroup,
  deleteRights,
  deleteFormPer,
  updatePerGroupUser,
  updatePerCustom,
  fetchPerData,
  getUserDetail,
  fetchPerGroupForm,
  fetchPerCustom,
  copyPerGroup,
} from './api';
import { fetchPageList } from '../api';
import { INIT_CURRENT_RIGHTS } from './constants';
import { deepClone } from '@lib/utils';

type PerData = {
  conditions: any,
  schema: any,
  authority: number,
}

class UserAndPerStore {
  @observable rightsLoading = true;
  @observable perFormLoading = true;
  @observable noSchema = false
  @observable perFormList: PerPageInfo[] = [];
  @observable menuList: PageInfo[] = [];
  @observable tempMenuList: PageInfo[] = [];
  @observable rightsList: Rights[] = [];
  @observable tempRightList: Rights[] = [];
  @observable appID = '';
  @observable rightsGroupID = '';
  @observable MenuKeyword = '';
  @observable currentRights: Rights = { id: '' };
  @observable Fields: SchemaFieldItem[] = [];
  @observable UserDetailList: [] =[]
  @observable perData: PerData = {
    conditions: {},
    schema: null,
    authority: 0,
  };

  @observable currentPage: PerPageInfo = { id: '', authority: 0 }
  @observable currentPageGroup: PageInfo | undefined = undefined

  @action
  setRightsGroupID = (groupID: string): void => {
    this.rightsGroupID = groupID;
  }

  @action
  deleteRight = (id: string): void => {
    const delAfter = this.rightsList.filter((rights) => id !== rights.id);
    deleteRights(this.appID, {
      id, moveArr: delAfter.map((AFrights, sequence) => {
        return { id: AFrights.id, sequence };
      }),
    }).then(() => {
      toast.success(
        `${this.currentRights.name}  权限组删除成功`,
      );
      this.rightsList = delAfter;
      this.rightsGroupID = '';
      this.tempRightList = deepClone(this.rightsList);
    });
  }

  @action
  changeKeyword = (keyword: string): void => {
    if (keyword) {
      this.rightsList = this.tempRightList.filter((rights: Rights) => rights.name?.match(keyword));
    } else {
      this.rightsList = deepClone(this.tempRightList);
    }
    this.currentRights = this.rightsList[0] || INIT_CURRENT_RIGHTS;
    this.rightsGroupID = this.rightsList[0]?.id;
  }

  @action
  fetchRights = (): void => {
    if (!this.appID) {
      return;
    }

    fetchRights(this.appID).then((res: any) => {
      const { list = [] } = res || {};
      this.rightsList = list;
      this.tempRightList = deepClone(this.rightsList);
    }).catch((err) => {
      toast.error(err);
    });
  }

  @action
  updatePerGroupUser = (rights: Rights): Promise<boolean> => {
    return updatePerGroupUser(this.appID, rights).then(() => {
      this.rightsList = this.rightsList.map((_rights) => {
        if (rights.id === _rights.id) {
          this.currentRights = { ..._rights, ...rights };
          return { ..._rights, ...rights };
        }
        return _rights;
      });
      this.tempRightList = deepClone(this.rightsList);
      toast.success('修改成功！');
      return true;
    });
  }

  @action
  updateUserAndPerStore = (): void => {
    this.rightsList = [...this.rightsList, this.currentRights];
    this.rightsGroupID = this.currentRights.id;
    this.tempRightList = [...this.rightsList];
  }

  @action
  addRightsGroup = (rights: RightsCreate): Promise<void> => {
    return createPerGroup(this.appID, rights).then((res: {id: string}) => {
      this.currentRights = { ...rights, ...res };
      this.updateUserAndPerStore();
    });
  }

  @action
  copyRightsGroup = (rights: Rights): Promise<void> => {
    return copyPerGroup(this.appID, {
      groupID: rights.id,
      name: rights.name,
      description: rights.description,
    }).then((res: {id: string}) => {
      this.currentRights = { ...this.currentRights, ...rights, ...res, scopes: [] };
      this.updateUserAndPerStore();
      toast.success('复制成功！');
    });
  }

  @action
  updatePerGroup = (rights: Rights): Promise<void | boolean> => {
    return updatePerGroup(this.appID, rights).then(() => {
      this.rightsList = this.rightsList.map((_rights) => {
        if (rights.id === _rights.id) {
          this.currentRights = { ..._rights, ...rights };
          return { ..._rights, ...rights };
        }

        return _rights;
      });
      this.tempRightList = deepClone(this.rightsList);
      toast.success('修改成功！');
      return true;
    });
  }

  @action
  updatePerCustom = (status: number): Promise<boolean> => {
    return updatePerCustom(this.appID, {
      groupId: this.rightsGroupID,
      pageId: this.currentPage.id,
      status,
    }).then(() => {
      toast.success('修改成功！');
      this.updatePerFormList({ ...this.currentPage, authority: status }, this.rightsGroupID);
      return true;
    }).catch((err) => {
      toast.success(err);
      return false;
    });
  }

  @action
  rightsGroupSort = (rightsIdList: string[]): void => {
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
    this.tempRightList = deepClone(this.rightsList );
  }

  @action
  changeMenuKeyword = (keyword: string): void => {
    this.MenuKeyword = keyword;
    if (keyword) {
      this.menuList = this.tempMenuList.filter((menu) =>
        menu.name?.match(this.MenuKeyword) ||
        menu.child?.filter((page) => page.name?.match(this.MenuKeyword)).length,
      );
    } else {
      this.menuList = deepClone(this.tempMenuList);
    }
  }

  @action
  fetchPerGroupForm = (perGroupID: string): void => {
    this.perFormLoading = true;
    Promise.all([
      fetchPageList(this.appID),
      fetchPerGroupForm(this.appID, perGroupID),
      fetchPerCustom(this.appID, perGroupID),
    ]).then(([allPageRes, perPage, PerCustom]) => {
      const { menu = [] } = allPageRes;
      const { formArr = [] } = perPage;
      const { pages = [] } = PerCustom;
      this.menuList = menu;
      this.tempMenuList = deepClone(this.menuList);

      if ( this.menuList.length) {
        let allPages: PageInfo[] = [];
        this.menuList.forEach((menu: PageInfo) => {
          if (menu.menuType === 1 && menu.child?.length) {
            allPages = allPages.concat(menu.child.map((cMenu) => {
              return cMenu;
            }));
            return;
          }

          allPages.push(menu);
        });
        this.perFormList = allPages.filter((formPage) =>
          formPage.menuType === 0 || formPage.menuType === 2).map((page) => {
          if (page.menuType === 0) {
            const curFormPer = formArr.find(({ id }) => id === page.id);
            return { ...page, authority: curFormPer ? curFormPer.authority : 0 };
          }

          const perCustomPage = pages.find((perCustomID) => perCustomID === page.id);
          return { ...page, authority: perCustomPage ? 1 : 0 };
        });
      }
      this.perFormLoading = false;
    }).catch(() => {
      this.perFormLoading = false;
    });
  }

  @action
  getPageSchema = (): void=> {
    this.rightsLoading = true;
    this.noSchema = false;
    if (this.currentPage.menuType === 0) {
      Promise.all([
        getTableSchema(this.appID, this.currentPage.id),
        fetchPerData(this.appID, { formID: this.currentPage.id, perGroupID: this.currentRights.id }),
      ]).then(([schemaRes, perDataRes]: any) => {
        const { schema } = schemaRes || {};
        if (schema) {
          this.Fields = (schemaToFields(schema));
          const { dataAccess, filter, opt } = perDataRes as any;

          this.perData = ({
            conditions: dataAccess ? dataAccess.conditions : {},
            schema: filter ? filter.schema : null,
            authority: opt ? opt.authority : 0,
          });
          this.rightsLoading = false;
          return;
        }
        this.noSchema = true;
        this.rightsLoading = false;
      }).catch((err) => {
        toast.error(err);
        this.rightsLoading = false;
      });
      return;
    }
    this.perData = {
      conditions: {},
      schema: null,
      authority: this.currentRights.types === 1 ? 1 : this.currentPage.authority,
    };
    this.rightsLoading = false;
  }

  @action
  updatePerFormList = (newPerForm: PerPageInfo, perGroupID: string): void => {
    this.perFormList = this.perFormList.map((perForm) => {
      if (perForm.id === newPerForm.id) {
        this.currentPage = { ...perForm, ...newPerForm };
        return { ...perForm, ...newPerForm };
      }

      return perForm;
    });

    const allPerSum = this.perFormList.reduce((accumulator, { authority }) => accumulator + authority, 0);
    this.rightsList = this.rightsList.map((rights) => {
      if (rights.id === perGroupID) {
        this.currentRights = { ...rights, add: allPerSum !== 0 };
        return {
          ...rights,
          add: allPerSum !== 0,
        };
      }
      return rights;
    });
    this.tempRightList = deepClone(this.rightsList);
  }

  @action
  deleteFormPer = (formID: string, perGroupID: string): Promise<void> => {
    return deleteFormPer(this.appID, { formID, perGroupID }).then(() => {
      this.updatePerFormList({ id: formID, authority: 0 }, perGroupID);
      toast.success('清除权限成功');
    });
  }

  @action
  fetchUserDetailList = (usersIDList: string[]): void => {
    getUserDetail<{user: []}>({
      query: `
      {user(ids:${JSON.stringify(usersIDList)}) {id , email ,userName ,phone ,dep{id,departmentName}}}
      `,
    }).then((res) => {
      this.UserDetailList = res?.user;
    }).catch((err) => {
      toast.error(err);
    });
  }
}

export default new UserAndPerStore();

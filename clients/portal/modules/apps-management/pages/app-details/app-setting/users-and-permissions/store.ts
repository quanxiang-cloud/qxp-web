import { action, observable } from 'mobx';

import toast from '@lib/toast';

import { fetchPageList } from '../../api';
import {
  fetchRights,
  movePerGroup,
  updatePerGroup,
  createPerGroup,
  deleteRights,
  fetchPerGroupForm,
  deleteFormPer,
  updatePerGroupUser,
} from './api';

type PerPageInfo = PageInfo & { authority: number };

class UserAndPerStore {
  @observable rightsLoading = true;
  @observable perFormLoading = true;
  @observable perFormList: PerPageInfo[] = [];
  @observable rightsList: Rights[] = [];
  @observable appID = '';

  @action
  addRightsGroup = (rights: RightsCreate) => {
    return createPerGroup(this.appID, rights).then((res: any) => {
      this.rightsList = [...this.rightsList, { ...rights, ...res }];
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
  fetchRights = () => {
    this.rightsLoading = true;
    fetchRights(this.appID).then((res: any) => {
      this.rightsList = res.list;
      this.rightsLoading = false;
    }).catch(() => {
      this.rightsLoading = false;
    });
  }

  @action
  updatePerGroupUser = (rights: Rights) => {
    return updatePerGroupUser(this.appID, rights).then(() => {
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

  @action
  fetchPerGroupForm = (perGroupID: string) => {
    this.perFormLoading = true;
    Promise.all([
      fetchPageList(this.appID),
      fetchPerGroupForm(this.appID, perGroupID),
    ]).then(([allPageRes, perPage]: any) => {
      const { formArr = [] } = perPage as { formArr: { id: string, authority: number }[] };
      let allPages: PageInfo[] = [];
      allPageRes.menu.forEach((menu: PageInfo) => {
        if (menu.menuType === 1 && menu.child?.length) {
          allPages = allPages.concat(menu.child.map((cMenu) => {
            return { ...cMenu, name: `${menu.name}/${cMenu.name}` };
          }));
          return;
        }

        allPages.push(menu);
      });
      this.perFormList = allPages.map((page) => {
        const curFormPer = formArr.find(({ id }) => id === page.id);
        return { ...page, authority: curFormPer ? curFormPer.authority : 0 };
      });
      this.perFormLoading = false;
    }).catch(() => {
      this.perFormLoading = false;
    });
  }

  @action
  updatePerFormList = (newPerForm: PerPageInfo, perGroupID: string) => {
    this.perFormList = this.perFormList.map((perForm) => {
      if (perForm.id === newPerForm.id) {
        return { ...perForm, ...newPerForm };
      }

      return perForm;
    });
    const allPerSum = this.perFormList.reduce((accumulator, { authority }) => accumulator + authority, 0);
    this.rightsList = this.rightsList.map((rights) => {
      if (rights.id === perGroupID) {
        return {
          ...rights,
          add: allPerSum !== 0,
        };
      }
      return rights;
    });
  }

  @action
  deleteFormPer = (formID: string, perGroupID: string) => {
    return deleteFormPer(this.appID, { formID, perGroupID }).then(() => {
      this.updatePerFormList({ id: formID, authority: 0 }, perGroupID);
      toast.success('清除成功');
    });
  }
}

export default new UserAndPerStore();

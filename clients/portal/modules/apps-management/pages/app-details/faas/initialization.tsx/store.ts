import { action, computed, observable, reaction } from 'mobx';

import {
  checkHasGroup,
  checkInGroup,
  checkIsDeveloper,
  createGroup,
  createDeveloper,
  addToGroup,
  fetchGroupList,
  bindGroup,
} from '../api';
import toast from '@lib/toast';
import { faasState } from '../constants';

type GroupSchema = {
  type: string;
  gid: number;
  name: string;
  describe: string
}

class IniStore {
  @observable step = 0;
  @observable appID = '';
  @observable groupID = '';
  @observable checkUserLoading = true;
  @observable modalType = '';
  @observable userAccount = '';
  @observable optionalGroup: Group[] = [];

  constructor() {
    reaction(() => this.modalType, this.fetchGroupList);
  }

  @computed get optionalGroupToSelectEnum(): { label: string, value: number }[] {
    return this.optionalGroup.map((group) => {
      return { label: group?.name || '', value: group.gid || 0 };
    });
  }

  @action
  setAppID = (appID: string): void => {
    this.appID = appID;
  };

  @action
  setGroupID = (groupID: string): void => {
    this.groupID = groupID;
  };

  @action
  setOptionalGroup = (optionalGroup: Group[]): void => {
    this.optionalGroup = optionalGroup;
  };

  @action
  setUserAccount = (userAccount: string): void => {
    this.userAccount = userAccount;
  };

  @action
  setStep = (step: number): void => {
    this.step = step;
  };

  @action
  setModalType = (type: string): void => {
    this.modalType = type;
  };

  @action
  checkUserState = async (): Promise<void> => {
    this.checkUserLoading = true;
    await this.developerCheck();
    this.step === faasState.DEVELOP && await this.isGroup();
    if (this.step === faasState.GROUP) {
      await this.isDeveloperInGroup();
    }
    this.checkUserLoading = false;
  };

  @action
  developerCheck = (): Promise<void> => {
    return checkIsDeveloper().then(({ userAccount }) => {
      if (userAccount) {
        this.setUserAccount(userAccount);
        this.setStep(faasState.DEVELOP);
      }
    }).catch((err) => toast.error(err));
  };

  @action
  isGroup = (): Promise<void> => {
    return checkHasGroup({
      appID: this.appID,
    }).then((groupID) => {
      if (groupID) this.setStep(faasState.GROUP);
      this.setGroupID(groupID);
    }).catch((err) => {
      toast.error(err);
    });
  };

  @action
  isDeveloperInGroup = (): Promise<void> => {
    return checkInGroup({
      groupID: this.groupID,
    }).then((isMember) => {
      if (isMember) this.setStep(faasState.INGROUP);
    }).catch((err) => {
      toast.error(err);
    });
  };

  @action
  createDeveloper = (data: { account: string }): Promise<void> => {
    return createDeveloper(data).then(() => {
      this.step = faasState.DEVELOP;
      this.userAccount = data.account;
      toast.success('绑定开发者账号成功');
    }).catch((error) => {
      toast.error(error);
    }).finally(() => this.setModalType(''));
  };

  @action
  fetchGroupList = (): void => {
    if (this.modalType === 'bindGroup') {
      fetchGroupList().then((res) => {
        this.setOptionalGroup(res);
      });
    }
  };

  @action
  onSubmitGroupModal = (formData: GroupSchema): void => {
    if (formData.type === 'custom') {
      this.createGroup(formData.name, formData.describe);
      return;
    }
    this.bindGroup(formData.gid);
  };

  @action
  createGroup = (name: string, describe: string): Promise<void> => {
    return createGroup({
      name,
      describe,
      appID: this.appID,
    }).then((groupID) => {
      this.step = faasState.GROUP;
      this.setGroupID(groupID);
      this.setModalType('');
      toast.success('绑定成功');
    });
  };

  @action
  bindGroup = (gid: number): void => {
    bindGroup({ gid, appID: this.appID })
      .then((groupID) => {
        this.step = faasState.GROUP;
        this.setModalType('');
        this.setGroupID(groupID);
        toast.success('绑定成功');
      });
  };

  @action
  addUserToGroup = (): void => {
    addToGroup(this.groupID).then(() => {
      this.step = faasState.INGROUP;
      this.setModalType('');
    }).catch((err) => {
      toast.error(err);
    });
  };
}

export default new IniStore();

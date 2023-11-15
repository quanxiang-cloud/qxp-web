import { action, observable } from 'mobx';

export interface SelectOption {
  value: string;
  label: string;
}
class ApprovalsActionStore {
  @observable loading = false;
  @observable remark = '';
  @observable handleUserIds: Array<string> = [];
  @observable taskDefKey = '';
  @observable multiplePersonWay = '';
  @observable type = '';
  @observable isValidate = true;
  @observable typeError = false;
  @observable multiplePersonWayError = false;
  @observable stepBackActivityList: Array<SelectOption> = [];

  @action setRemark = (remark: string): void => {
    this.remark = remark;
  };

  @action setIsValidate = (isValidate: boolean): void => {
    this.isValidate = isValidate;
  };

  @action reset = (): void => {
    this.handleUserIds = [];
    this.remark = '';
    this.type = '';
    this.multiplePersonWay = '';
    this.typeError = false;
    this.multiplePersonWayError = false;
    this.isValidate = true;
  };
}

export default new ApprovalsActionStore();

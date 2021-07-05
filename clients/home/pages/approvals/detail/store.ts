import { action, observable } from 'mobx';
import toast from '@lib/toast';

import actionMap from './action-map';

type ModalInfo = {
  title: string,
  payload: Record<string, any>
}

type TaskItem = {
  taskName: string;
  taskType: string;
  formData: Record<string, any>;
}

const initTaskItem = {
  taskName: '',
  taskType: '',
  formData: {},
};

class TaskDetailStore {
  @observable taskItem: TaskItem = initTaskItem;
  @observable action = '';
  @observable modalOpen = false;
  @observable showTips = false;

  @observable modalInfo: ModalInfo = {
    title: '',
    payload: {},
  };

  @action
  setModalInfo = (info: Partial<ModalInfo> = {}) => {
    Object.assign(this.modalInfo, info);
  }

  @action
  setAction = (action: TaskHandleType | string) => {
    this.action = action;
  }

  @action
  openModal = (open?: boolean) => {
    this.modalOpen = Boolean(open);
  }

  @action
  setTaskItem = (task: any): void => {
    this.taskItem = task;
  }

  @action
  handleClickAction = (action: TaskHandleType | string, task: any): void => {
    if (!Object.prototype.hasOwnProperty.call(actionMap, action)) {
      toast.error(`action=${action} 未定义的操作`);
      return;
    }

    this.setTaskItem(task);
    this.setAction(action);
    this.openModal(true);
    this.setModalInfo({
      title: actionMap[action]?.text,
    });
  }

  @action
  setShowTips = (show?: boolean) => {
    this.showTips = Boolean(show);
  }

  reset = () => {
    this.taskItem = initTaskItem;
    this.action = '';
    this.modalOpen = false;
    this.modalInfo = { title: '', payload: {} };
    this.showTips = false;
  }
}

export default new TaskDetailStore();

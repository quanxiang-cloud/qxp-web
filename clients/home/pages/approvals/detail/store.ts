import { action, observable } from 'mobx';
import toast from '@lib/toast';

import actionMap from './action-map';

type ModalInfo = {
  require?: boolean,
  title: string,
  payload: Record<string, any>
}

type TaskItem = {
  taskName: string;
  taskType: string;
}

const initTaskItem = {
  taskName: '',
  taskType: '',
};

class TaskDetailStore {
  @observable taskItem: TaskItem = initTaskItem;
  @observable action = '';
  @observable modalOpen = false;
  @observable showTips = false;

  @observable modalInfo: ModalInfo = {
    require: false,
    title: '',
    payload: {},
  };

  @action
  setModalInfo = (info: Partial<ModalInfo> = {}): void => {
    Object.assign(this.modalInfo, info);
  }

  @action
  setAction = (action: TaskHandleType | string): void => {
    this.action = action;
  }

  @action
  openModal = (open?: boolean): void => {
    this.modalOpen = Boolean(open);
  }

  @action
  setTaskItem = (task: any): void => {
    this.taskItem = task;
  }

  @action
  handleClickAction = (action: TaskHandleType | string, task: any, reasonRequired?: boolean): void => {
    if (!Object.prototype.hasOwnProperty.call(actionMap, action)) {
      toast.error(`action=${action} 未定义的操作`);
      return;
    }

    this.setTaskItem(task);
    this.setAction(action);
    this.openModal(true);
    this.setModalInfo({
      require: reasonRequired || false,
      title: actionMap[action]?.text,
    });
  }

  @action
  setShowTips = (show?: boolean): void => {
    this.showTips = Boolean(show);
  }

  reset = (): void => {
    this.taskItem = initTaskItem;
    this.action = '';
    this.modalOpen = false;
    this.modalInfo = { title: '', payload: {} };
    this.showTips = false;
  }
}

export default new TaskDetailStore();

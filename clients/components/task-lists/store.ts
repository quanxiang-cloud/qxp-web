import { observable, action } from 'mobx';

import { getTaskCount } from './api';

class TaskListStore {
  @observable inProgressCount = 0;

  @action
  refreshInProgressCount = (): Promise<number> => {
    return getTaskCount().then((count) => {
      this.inProgressCount = count || 0;
      return this.inProgressCount;
    });
  }
}

export default new TaskListStore();

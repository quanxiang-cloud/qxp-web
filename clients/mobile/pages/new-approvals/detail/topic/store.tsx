import { action, observable } from 'mobx';

import { getComments } from '@home/pages/approvals/api';
import toast from '@lib/toast';
import { formatRelativeTime } from '@m/lib/formatter';

import { Comment } from './types';

class TopicStore {
  @observable comments: Comment[] = [];
  @observable loading = false;
  @observable inited = false;

  @action updateComments = async (processInstanceId: string, taskId?: string): Promise<void> => {
    this.loading = true;
    try {
      const res = await getComments(processInstanceId, taskId ?? '0');
      if (res) {
        const mapped = (res as Comment[])
          .filter((comment) => !comment.isDeleted)
          .map((comment) => {
            const time = comment.modifyTime || comment.createTime;
            if (time) {
              comment.modifyTime = formatRelativeTime(time);
            }
            return comment;
          })
          .reverse();
        this.comments = mapped ?? [];
      }
      this.loading = false;
    } catch (e) {
      toast.error(e);
      this.loading = false;
    }

    if (!this.inited) this.inited = true;
  };

  @action clear = (): void => {
    this.comments = [];
    this.loading = false;
    this.inited = false;
  };
}

export default new TopicStore();

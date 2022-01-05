import { Task } from '@m/pages/approvals/types';
import { formatOverTime } from '@m/lib/formatter';

export interface TaskTag {
  overTime?: string;
  urgeTime?: string;
}

export function computeTaskTag(task?: Task): TaskTag {
  if (!task) return {};
  const tag: TaskTag = {};
  // Check if the task is over time.
  tag.overTime = formatOverTime(task.dueDate);

  // Check the urge number
  if (task.urgeNum) {
    tag.urgeTime = `被催办+${task.urgeNum}`;
  }
  return tag;
}

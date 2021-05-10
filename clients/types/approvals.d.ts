// type ApprovalCatalog = 'todo' | 'done' | 'cc_to_me' | 'my_applies';

type ApprovalTask = {
  id: string; // task id

  name: string; // task name

  description?: string;

  createTime: string; // Task create time

  startTime?: string;

  endTime?: string; // Task end time

  flowInstanceEntity: FlowInstance;

  processInstanceId?: string;

  assignee?: string; // Assignee user id

  deleteReason?: string; // Delete reason

  dueDate?: string; // Task due date

  durationInMillis?: number; // Task duration time
};


import { FlowAction, OperatorPermissionItem, TaskDetail, TaskDetailModel } from '../types';

export const flowActionMap: { [key: string]: FlowAction } = {
  DELIVER: { text: '转交', icon: 'm-deliver', key: 'DELIVER' },
  ENTRUST: { text: '转交', icon: 'm-deliver', key: 'ENTRUST' },
  STEP_BACK: { text: '回退', icon: 'subdirectory_arrow_left', key: 'STEP_BACK' },
  SEND_BACK: { text: '打回重填', icon: 'settings_backup_restore', key: 'SEND_BACK' },
  CC: { text: '抄送', icon: 'send', key: 'CC' },
  ADD_SIGN: { text: '加签', icon: 'person_add_alt', key: 'ADD_SIGN' },
  READ: { text: '邀请阅示', icon: 'eye-open', key: 'READ' },
  MORE: { text: '更多', icon: 'more_horiz', key: 'MORE' },

  // global defined action, match backend fields
  AGREE: { text: '通过', icon: 'done', style: 'dark', key: 'AGREE' },
  REFUSE: { text: '拒绝', icon: 'close', style: 'light', key: 'REFUSE' },
  CANCEL: { text: '撤销', icon: 'delete', style: 'light', key: 'CANCEL' },
  hasCancelBtn: { text: '撤销', icon: 'delete', style: 'light', key: 'hasCancelBtn' },
  hasReadHandleBtn: { text: '阅示', icon: 'eye-open', style: 'dark', key: 'hasReadHandleBtn' },
  hasCcHandleBtn: { text: '标记已读', icon: 'done_all', style: 'dark', key: 'hasCcHandleBtn' },
  FILL_IN: { text: '补充', icon: 'free_breakfast', style: 'dark', key: 'FILL_IN' },
  hasResubmitBtn: { text: '重新提交', icon: 'free_breakfast', style: 'dark', key: 'hasResubmitBtn' },
  hasUrgeBtn: { text: '催办', icon: 'alarm', style: 'dark', key: 'hasUrgeBtn' },
};

export function mapTaskDetail(model: TaskDetailModel): TaskDetail {
  const {
    hasResubmitBtn, hasUrgeBtn, hasCcHandleBtn,
    hasReadHandleBtn, hasCancelBtn, operatorPermission,
  } = model;
  const custom: FlowAction[] = [];
  const system: FlowAction[] = [];
  const more: FlowAction[] = [];
  if (operatorPermission) {
    operatorPermission.custom?.forEach((item: OperatorPermissionItem) => {
      if (!item?.enabled) return;
      const action: FlowAction = flowActionMap[item.value];
      if (action) {
        if (item.text) {
          action.text = item.text;
        }
        action.reasonRequired = item.reasonRequired;
        custom.push(action);
      }
    });

    operatorPermission.system?.forEach((item: OperatorPermissionItem) => {
      if (!item?.enabled) return;
      const action: FlowAction = flowActionMap[item.value];
      if (action) {
        if (item.text) {
          action.text = item.text;
        }
        action.reasonRequired = item.reasonRequired;
        if (system.length > 1) custom.push(action);
        else system.push(action);
      }
    });
  }

  const buttons = [hasCancelBtn, hasResubmitBtn, hasReadHandleBtn, hasUrgeBtn, hasCcHandleBtn];
  const buttonKeys = ['hasCancelBtn', 'hasResubmitBtn', 'hasReadHandleBtn', 'hasUrgeBtn', 'hasCcHandleBtn'];
  buttons.forEach((btn, index) => {
    if (btn) {
      const action = flowActionMap[buttonKeys[index]];
      if (system.length > 1) custom.push(action);
      else system.push(action);
    }
  });

  mapActions(custom, system, more);
  return { taskId: model.taskId, custom, system, more, taskName: model.taskName || '详情' };
}

function stylePriority(action: FlowAction): number {
  if (action.style === 'light') {
    return -1;
  } else if (action.style === 'dark') {
    return 1;
  } else {
    action.style = 'light';
    return -1;
  }
}

function mapActions(custom: FlowAction[], system: FlowAction[], more: FlowAction[]): void {
  system.sort((a, b) => stylePriority(a) - stylePriority(b));
  switch (system.length) {
  case 0:
    // We can place max to 7 custom actions
    spliceCustom(7, custom, more);
    break;
  case 1:
    spliceCustom(3, custom, more);
    if (custom.length < 1) {
      system[0].className = `body1 action-button__system1 action-button__${system[0].style}`;
    } else {
      system[0].className = `body1 action-button__system2 action-button__${system[0].style}`;
    }
    break;
  case 2:
    spliceCustom(3, custom, more);

    if (system[0].style === 'dark' && system[1].style === 'dark') {
      system[0].style = 'light';
    } else if (system[0].style === 'light' && system[1].style === 'light') {
      system[1].style = 'dark';
    }

    if (custom.length < 1) {
      system[0].className = `body1 action-button__system1_1 action-button__${system[0].style}`;
      system[1].className = `body1 action-button__system1_2 action-button__${system[1].style}`;
    } else {
      system[0].className = `body1 action-button__system2_1 action-button__${system[0].style}`;
      system[1].className = `body1 action-button__system2_2 action-button__${system[1].style}`;
    }
    break;
  }
}

function spliceCustom(maxLen: number, custom: FlowAction[], more: FlowAction[]): void {
  if (custom.length > maxLen) {
    // Delete one more, to add more icon
    const spliced = custom.splice(maxLen - 1, custom.length - maxLen + 1);
    custom.unshift(flowActionMap.MORE);
    more.push(...spliced);
  }
}

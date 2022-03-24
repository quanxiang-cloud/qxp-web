export interface Action {
  title: string,
  actionName?: string
}

export const actions: { [key: string]: Action } = {
  DELIVER: { title: '转交' },
  ENTRUST: { title: '转交' },
  STEP_BACK: { title: '回退' },
  SEND_BACK: { title: '打回重填', actionName: '打回' },
  CC: { title: '抄送' },
  ADD_SIGN: { title: '加签' },
  READ: { title: '邀请阅示', actionName: '邀请' },
  FILL_IN: { title: '提交' },
  hasResubmitBtn: { title: '重新提交', actionName: '提交' },

  // global defined action, match backend fields
  AGREE: { title: '通过 :flowName', actionName: '通过' },
  REFUSE: { title: '拒绝 :flowName', actionName: '拒绝' },
  hasReadHandleBtn: { title: '阅示' },
};

export function getAction(action?: string, flowName?: string): Action {
  const actionObj = actions[action || ''];
  if (actionObj) {
    return {
      title: actionObj.title.replace(':flowName', flowName || ''),
      actionName: actionObj.actionName || actionObj.title,
    };
  }
  return { title: '', actionName: '' };
}

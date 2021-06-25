const actionMap: Record<TaskHandleType | string, any> = {
  CANCEL: { text: '撤回', icon: '' },
  AGREE: { text: '通过', icon: 'done' },
  REFUSE: { text: '拒绝', icon: 'close' },
  FILL_IN: { text: '补充', icon: 'free_breakfast' },
  DELIVER: { text: '转交', icon: 'send' },
  STEP_BACK: { text: '退回某步', icon: 'subdirectory_arrow_left' },
  SEND_BACK: { text: '打回重填', icon: 'settings_backup_restore' },
  CC: { text: '抄送', icon: 'send' },
  ADD_SIGN: { text: '加签', icon: 'person_add_alt' },
  READ: { text: '阅示', icon: 'eye-open' },

  // global defined action, match backend fields
  canMsg: { text: '评论', icon: '' },
  canViewStatusAndMsg: { text: '显示动态和评论', icon: '' },
  hasCancelBtn: { text: '撤回', icon: '' },
  hasCcHandleBtn: { text: '标记已读', icon: '' },
  hasReadHandleBtn: { text: '阅示', icon: 'eye-open' }, // 邀请阅示者来阅示，区别于 邀请阅示
  hasResubmitBtn: { text: '再次提交', icon: '' },
  hasUrgeBtn: { text: '催办', icon: '' },
};

export default actionMap;

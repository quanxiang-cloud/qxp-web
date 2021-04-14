export enum MsgReadStatus {
  all=0,
  unread = 1, // 未读
  read = 2, // 已读
}

export enum MsgType {
  all=0,
  system = 1, // 系统消息
  notify = 2, // 通知通告
}

export enum MsgSendStatus {
  all=0,
  draft = 1, // 草稿
  sending = 2, // 发送中
  success = 3, // 发送成功
}

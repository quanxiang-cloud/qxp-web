// msg center types definition

declare enum MsgReadStatus {
  all = 0,
  unread = 1, // 未读
  read = 2, // 已读
}

declare enum MsgType {
  all = 0,
  system = 1, // 系统消息
  notify = 2, // 通知通告
}

declare enum MsgSendStatus {
  draft = 1, // 草稿
  sending = 2, // 发送中
  success = 3, // 发送成功
}

declare namespace Qxp {
  interface MsgTypeCount {
    total: number;
    types: MsgType;
  }

  type Receiver = {
    type: number;
    id: string;
    name: string;
    account: string;
  }

  interface MsgDetail {
    id?: string;
    content?: string;
    title?: string;
    readStatus?: MsgReadStatus;
    sort?: MsgType;
    mes_attachment?: string[];
    receivers?: Receiver[];
    createdAt?: number;
  }

  type MsgReceiver = {
    type: 1 | 2; // 1、人员  2、部门
    id: string;
    name?: string;
    ownerName?: string;
    departmentName?: string;
  }

  type MsgArg = {
    key: string;
    value: string;
  }

  type Content = {
    content: string
  }

  type MsgArgs = {
    id: string,
    isSend: boolean,
    title: string,
    contents: Content
    files?: File,
    recivers?: Array<MsgReceiver>,
    types?: number
  }

  interface File {
    file_name?: string
    file_url?: string
    fileName?: string,
    url?: string;
  }

  interface NewMsgData {
    id?: string; // 更新时需要id
    title?: string;
    args?: Array<MsgArg>;
    channel?: string; // fixme 发送渠道 ，站内信： letter  邮件：?
    receivers?: Array<MsgReceiver>,
    content?: string;
    fail?: number;
    success?: number;
    types?: number;
    sendNum?: number;
    creatorName?: string,
    files?: Array<File>,
  }

  interface CreateMsgData {
    web: MsgArgs
  }

  interface QueryMsgResult {
    id: string;
    status: MsgSendStatus;
    types: MsgType;
    title: string;
    createdName: string;
    createdAt: number;
    sendNum: number;
    success: number;
    fail?: number;
  }

  interface MsgItem {
    id: string;
    title: string;
    createdAt: number;
    types: MsgType;
    readStatus?: MsgReadStatus
  }

  interface TaskItem {
    id: string;
    title: string;
    status: number;
    command: string;
    createdAt: number;
    finishAt: number;
    result: {
      path: { fileName: string, url: string }[],
      title: string
    };
    value: { appID: string, tableID: string }
    ratio: number;
  }

  interface TaskItem {
    id: string;
    title: string;
    status: number;
    command: string;
    createdAt: number;
    finishAt: number;
    result: {
      path: { fileName: string, url: string }[],
      title: string
    };
    value: { appID: string, tableID: string }
    ratio: number;
  }

  interface FileInfo {
    filename: string
    url: string
  }

  interface DraftData {
    title: string;
    content: string;
    receivers: Array<MsgReceiver>;
    type: MsgType; // fixme: remove
    sort?: number | MsgType; // real msg type
    files?: Array<File>;
    createdAt: number;
    creatorName?: string;
    types?: number
  }
}


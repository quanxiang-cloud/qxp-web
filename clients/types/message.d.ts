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
    sort: MsgType;
  }

  interface MsgDetail {
    id?: string;
    content?: string;
    title?: string;
    handle_name?: string;
    read_status?: MsgReadStatus;
    sort?: MsgType;
    created_at?: number;
    update_at?: number;
  }

  type MsgReceiver = {
    type: number; // 1、人员  2、部门
    id: string;
    name: string;
  }

  type MsgArg = {
    key: string;
    value: string;
  }

  interface File {
    file_name: string
    file_url: string
  }

  interface NewMsgData {
    id?: string; // 更新时需要id
    template_id?: string; // 模板id ，默认写 "quanliang"
    title?: string;
    args?: Array<MsgArg>;
    channel?: string; // fixme 发送渠道 ，站内信： letter  邮件：?
    type?: number;
    sort?: MsgType;
    is_send?: boolean; // 是否需要发送
    recivers?: Array<MsgReceiver>,
    mes_attachment?: Array<File>
  }

  interface QueryMsgResult {
    id: string;
    status: MsgSendStatus;
    sort: MsgType;
    title: string;
    handle_name: string;
    updated_at: number;
    send_num: number;
    success: number;
    fail?: number;
  }

  interface MsgItem {
    id: string;
    title: string;
    updated_at: number;
    sort: MsgType;
    read_status?: MsgReadStatus
  }

  interface FileInfo{
    filename: string
    url: string
  }

  interface DraftData {
    title: string;
    content: string;
    receivers: Array<MsgReceiver>;
    type: MsgType; // fixme: remove
    sort?: number | MsgType; // real msg type
    mes_attachment?: Array<File>;
    handle_name?: string;
  }
}


export interface MessageAttachment {
  attachmentName?: string;
  attachmentUrl?: string;
  id?: string;
  isDeleted?: number;
  modifyTime?: string;
}

export interface Comment {
  attachments: MessageAttachment[];
  commentUserId: string;
  content: string;
  creatorAvatar: string;
  creatorId: string;
  creatorName: string;
  flowInstanceId: string;
  id: string;
  isDeleted: number;
  taskId: string;
  modifyTime: string;
  createTime: string;
}

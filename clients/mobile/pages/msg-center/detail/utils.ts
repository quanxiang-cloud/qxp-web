import { formatTimeSeconds } from '@m/lib/formatter';

export interface Attachment {
  fileName: string;
  url: string;
}

export interface Message {
  id: string;
  content: string;
  title: string;
  types: number;
  createdAt: number;
  updateAt: number;
  creatorName: string;
  files?: Attachment[];
}

export function getSubtitle(data?: Message): string {
  if (!data) return '';
  const updateTime = data.updateAt ?? data.createdAt ?? 0;
  const updated = updateTime > 0 ? formatTimeSeconds(updateTime, false) : '';
  let types: string;
  switch (data.types) {
  case 1:
    types = '系统消息';
    break;
  case 2:
    types = '通知公告';
    break;
  default:
    types = '';
  }
  const creatorName = data.creatorName ?? '';
  const separator = ' · ';
  return [updated, types, creatorName]
    .filter((element) => element.length > 0)
    .join(separator);
}

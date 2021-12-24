import { formatTimeSeconds } from '@m/lib/formatter';

export interface Attachment {
  file_name: string;
  file_url: string;
}

export interface Message {
  id: string;
  content: string;
  title: string;
  sort: number;
  created_at: number;
  update_at: number;
  handle_name: string;
  mes_attachment?: Attachment[];
}

export function getSubtitle(data?: Message): string {
  if (!data) return '';
  const updated = data.update_at > 0 ? formatTimeSeconds(data.update_at, false) : '';
  let sort: string;
  switch (data.sort) {
  case 1:
    sort = '系统消息';
    break;
  case 2:
    sort = '通知公告';
    break;
  default:
    sort = '';
  }
  const handleName = data.handle_name ?? '';
  const separator = ' · ';
  return [updated, sort, handleName]
    .filter((element) => element.length > 0)
    .join(separator);
}

import ws from '@lib/push';

import { subscribe } from './api';

export function subscribeStatusChange(taskID: string): Promise<void> {
  return subscribe({
    userID: window.USER.id,
    uuid: ws.uuid,
    topic: 'entrepot-task',
    key: taskID,
  });
}

import { useEffect } from 'react';

import ws, { SocketData } from '@lib/push';
import toast from '@lib/toast';

import store from './store';
import { subscribe } from './api';
import { TaskStatus } from './type';

export function subscribeStatusChange(taskID: string, actionName: string): Promise<boolean> {
  return subscribe(taskID).then((res) => {
    if (res.status === TaskStatus.fail) {
      toast.error(`${actionName}失败，请在右上方“同步列表”中查看${actionName}结果`);
    } else if (!res.isFinish) {
      store.refreshInProgressCount();
      toast.success(`正在${actionName}，请在右上方“同步列表”中查看${actionName}进度`);
    } else {
      toast.success(`${actionName}成功，请在右上方“同步列表”中查看${actionName}结果`);
    }

    return res.isFinish && res.status === TaskStatus.success;
  });
}

export function useTaskComplete(key: string, cb: (value: SocketData) => void): void {
  useEffect(() => {
    ws.addEventListener('entrepot-task', key, (socketData) => {
      if (socketData.content.types === 'result') {
        cb(socketData);
      }
    });

    return () => {
      ws.removeEventListener('entrepot-task', key);
    };
  }, []);
}

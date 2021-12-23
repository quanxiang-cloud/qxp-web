import { ESParameter } from '@c/data-filter/utils';
import httpClient from '@lib/http-client';
import toast from '@lib/toast';
import ws from '@lib/push';

import { TaskStatus } from './type';

type GetTasksParams = {
  limit: number;
  page: number;
  status?: number;
}

type ImportParam = {
  addr: string,
  opt: string,
  size: number,
  value: {
    appID: string,
    tableID: string
  },
  title: string,
}

type ExportParam = {
  value: {
    appID: string,
    tableID: string
    query: ESParameter,
    filterKey: string[],
    filterName: string[],
  },
  title: string,
}

export function getTaskList(params: GetTasksParams): Promise<Qxp.TaskItem[]> {
  return httpClient<{ list: Qxp.TaskItem[] }>('/api/v1/entrepot/task/list', {
    types: window.SIDE === 'portal' ? 'manager' : 'home',
    ...params,
  }).then((res) => res.list || []).catch((err) => {
    toast.error(err);
    return [];
  });
}

export function getFormTemplate(
  data: { value: { appID: string, tableID: string }, title: string },
): Promise<string> {
  return httpClient<{ taskID: string }>('/api/v1/entrepot/task/create/formTemplate', data)
    .then((res) => res?.taskID)
    .catch((err) => {
      toast.error(err);
      return '';
    });
}

export function getTaskDetail(taskID: string): Promise<Qxp.TaskItem> {
  return httpClient<Qxp.TaskItem>(`/api/v1/entrepot/task/get/${taskID}`);
}

export function importForm(
  data: ImportParam,
): Promise<string> {
  return httpClient<{ taskID: string }>('/api/v1/entrepot/task/create/formImport', data)
    .then((res) => res?.taskID)
    .catch((err) => {
      toast.error(err);
      return '';
    });
}

export function exportForm(
  data: ExportParam,
): Promise<string> {
  return httpClient<{ taskID: string }>('/api/v1/entrepot/task/create/formExport', data)
    .then((res) => res?.taskID)
    .catch((err) => {
      toast.error(err);
      return '';
    });
}

export function subscribe(
  taskID: string,
): Promise<{ isFinish: boolean, status: TaskStatus }> {
  return httpClient('/api/v1/entrepot/task/subscribe', {
    userID: window.USER.id,
    uuid: ws.uuid,
    topic: 'entrepot-task',
    key: taskID,
  });
}

export function deleteTask(taskID: string): Promise<void> {
  return httpClient<void>(`/api/v1/entrepot/task/delete/${taskID}`)
    .then(() => toast.success('删除成功'))
    .catch((err) => toast.error(err));
}

export function getTaskCount(): Promise<number> {
  return httpClient<{ total: number }>(
    '/api/v1/entrepot/task/processing',
    { types: window.SIDE === 'portal' ? 'manager' : 'home' },
  ).then((res) => res.total);
}

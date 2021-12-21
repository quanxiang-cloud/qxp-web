import { ESParameter } from '@c/data-filter/utils';
import httpClient from '@lib/http-client';
import toast from '@lib/toast';

type GetTasksParams = {
  types: string;
  limit: number;
  page: number;
}

type SubscribeParams = {
  userID: string;
  uuid: string;
  topic: string;
  key: string;
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
  return httpClient<{ list: Qxp.TaskItem[] }>('/api/v1/entrepot/task/list', params)
    .then((res) => res.list || [])
    .catch((err) => {
      toast.error(err);
      return [];
    });
}

export function getFormTemplate(
  data: { value: { appID: string, tableID: string }, title: string },
): Promise<string> {
  return httpClient<{ taskID: string }>('/api/v1/entrepot/task/create/formTemplate', data)
    .then((res) => res?.taskID )
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
    .then((res) => res?.taskID )
    .catch((err) => {
      toast.error(err);
      return '';
    });
}

export function exportForm(
  data: ExportParam,
): Promise<string> {
  return httpClient<{ taskID: string }>('/api/v1/entrepot/task/create/formExport', data)
    .then((res) => res?.taskID )
    .catch((err) => {
      toast.error(err);
      return '';
    });
}

export function subscribe(
  subscribeParams: SubscribeParams,
): Promise<void> {
  return httpClient('/api/v1/entrepot/task/subscribe', subscribeParams);
}

export function deleteTask(taskID: string): Promise<void> {
  return httpClient<void>(`/api/v1/entrepot/task/delete/${taskID}`)
    .then(() => toast.success('删除成功'))
    .catch((err) => toast.error(err));
}

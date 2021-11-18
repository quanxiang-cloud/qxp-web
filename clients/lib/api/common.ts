import httpClient from '@lib/http-client';

type SubscribeParams = {
  topic: string;
  key: string;
  uuid: string;
}

export function wsSubscribe(params: SubscribeParams): Promise<TaskForm> {
  return httpClient('/api/v1/midfielder/cm/subscribe', params);
}

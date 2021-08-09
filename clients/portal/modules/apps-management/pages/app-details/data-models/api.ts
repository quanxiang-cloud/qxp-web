import httpClient from '@lib/http-client';

type DataModelsParameter = { title?: string, page?: number, size?: number };

type DataModelListRes = {
  list: DataModel[];
  total: number;
}

export const fetchDataModels = (
  appID: string,
  data: DataModelsParameter,
): Promise<DataModelListRes | null> => {
  return httpClient(`/api/v1/structor/${appID}/m/table/search`, data);
};

export const deleteSchema = (
  appID: string,
  id:string,
): Promise<void> => {
  return httpClient(`/api/v1/structor/${appID}/m/table/delete`, { id });
};

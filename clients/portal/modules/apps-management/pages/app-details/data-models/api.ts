import httpClient from '@lib/http-client';

type DataModelsParameter = { title?: string, page?: number, size?: number };

type DataModelListRes = {
  list: DataModel[];
  total: number;
}

export function fetchDataModels(
  appID: string,
  data: DataModelsParameter,
): Promise<DataModelListRes | null> {
  return httpClient(`/api/v1/structor/${appID}/m/table/search`, data);
}

export function deleteSchema(
  appID: string,
  tableID: string,
): Promise<void> {
  return httpClient(`/api/v1/structor/${appID}/m/table/delete`, { tableID });
}

export function saveTableSchema(
  appID: string, tableID: string, schema: ISchema, source?: SchemaSource,
): Promise<{ tableID: string; }> {
  return httpClient(
    `/api/v1/structor/${appID}/m/table/create`,
    { tableID, schema, source },
  );
}

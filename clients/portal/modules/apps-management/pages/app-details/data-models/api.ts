import httpClient from '@lib/http-client';

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

export function modelCodeCheckRepeat(
  appID: string, tableID: string,
): Promise<{ exist: boolean; }> {
  return httpClient(
    `/api/v1/structor/${appID}/m/table/checkRepeat`,
    { tableID },
  );
}

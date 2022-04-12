import httpClient from '@lib/http-client';

export function deleteSchema(
  appID: string,
  tableID: string,
): Promise<void> {
  return httpClient(`/api/v1/form/${appID}/m/table/delete`, { tableID });
}

export function saveTableSchema(
  appID: string, tableID: string, schema: ISchema, source?: SchemaSource,
): Promise<{ tableID: string; }> {
  return httpClient(
    `/api/v1/form/${appID}/m/table/create`,
    { tableID, schema, source },
  );
}

export function modelDuplicate(
  appID: string, duplicateTableID: string, newTableID: string, name: string, describe: string,
): Promise<{ tableID: string; }> {
  return httpClient(
    `/api/v1/form/${appID}/m/table/customDuplicate`,
    { duplicateTableID, newTableID, name, describe },
  );
}

type CheckRepeatRes = {
  tableID?: string;
  title: string;
  isModify: boolean;
}

export function modelCodeCheckRepeat(
  appID: string, data: CheckRepeatRes,
): Promise<{ exist: boolean; }> {
  return httpClient(
    `/api/v1/form/${appID}/m/table/checkRepeat`,
    data,
  );
}

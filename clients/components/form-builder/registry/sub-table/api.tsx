import httpClient from '@lib/http-client';
import toast from '@lib/toast';

export async function createBlankFormTable({ appID }: { appID: string}): Promise<
  {tableID: string} | null
> {
  try {
    return await httpClient(`/api/v1/structor/${appID}/m/table/createBlank`);
  } catch (err) {
    toast.error(err);
    return null;
  }
}

export async function getFormTableSchema<T>({ appID, tableID }: { appID: string, tableID: string }) {
  try {
    return await httpClient<T>(`/api/v1/structor/${appID}/m/table/getByID`, { tableID },
      { 'X-Proxy': 'FORM_SCHEMA' }
    );
  } catch (err) {
    toast.error(err);
    return null;
  }
}

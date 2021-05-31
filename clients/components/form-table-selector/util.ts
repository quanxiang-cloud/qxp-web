import httpClient from '@lib/http-client';

export async function getFormFieldSchema({ appID, tableID }: { appID: string; tableID: string }) {
  try {
    const data = await httpClient(`/api/v1/structor/${appID}/m/table/getByID`, {
      tableID,
    });
    return data ?? null;
  } catch {
    return null;
  }
}

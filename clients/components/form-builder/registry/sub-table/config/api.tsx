import httpClient from '@lib/http-client';
import toast from '@lib/toast';

export async function createBlankFormTable({ appID }: { appID: string}): Promise<
  {tableID: string} | null
> {
  try {
    return await httpClient(`/api/v1/form/${appID}/m/table/createBlank`);
  } catch (err) {
    toast.error(err);
    return null;
  }
}


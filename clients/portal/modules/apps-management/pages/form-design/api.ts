import { TableConfig, TableColumnConfig } from '@c/form-app-data-table/type';
import httpClient from '@lib/http-client';

type createPageSchemeParam = {
  tableID: string;
  config: {
    pageTableColumns: TableColumnConfig[];
    filters: Filters;
    pageTableShowRule: TableConfig;
  },
}

export const createPageScheme = async <T>(appID: string, data: createPageSchemeParam): Promise<T> => {
  return await httpClient<T>(`/api/v1/structor/${appID}/m/config/create`, data);
};


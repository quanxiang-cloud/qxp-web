import { toEs } from '@c/data-filter/utils';
import schemaToFields from '@lib/schema-convert';
import type { ESParameter } from '@c/data-filter/utils';
import httpClient from './http-client';

export function buildQueryRef(schema: ISchema): FormDataRequestUpdateParamsRef {
  const refFields = schemaToFields(schema, (schemaField) => {
    return ['SubTable', 'AggregationRecords', 'AssociatedRecords'].includes(schemaField['x-component'] || '');
  });

  const ref: FormDataRequestUpdateParamsRef = {};
  if (refFields.length) {
    refFields.forEach((field) => {
      switch (field.componentName) {
      case 'subtable': {
        const { subordination, appID, tableID } = field?.['x-component-props'] || {};
        ref[field.id] = {
          type: subordination || 'sub_table',
          appID,
          tableID,
        };
        break;
      }
      case 'associatedrecords': {
        const { appID, tableID } = field?.['x-component-props'] || {};
        ref[field.id] = {
          type: 'associated_records',
          appID,
          tableID,
        };
        break;
      }
      case 'aggregationrecords': {
        const {
          sourceFieldId, appID, tableID, aggType, fieldName, condition,
        } = field?.['x-component-props'] || {};

        ref[field.id] = {
          type: 'aggregation',
          query: condition ? toEs(condition) : null,
          tableID,
          appID,
          sourceFieldId,
          aggType,
          fieldName,
        };
        break;
      }
      }
    });
  }

  return ref;
}

export function findOneFormDataRequest(
  appID: string,
  tableID: string,
  rowID: string,
  schema: ISchema,
): Promise<Record<string, any>> {
  if (!rowID) {
    return Promise.resolve({});
  }

  return httpClient<FormDataResponse>(
    `/api/v1/form/${appID}/home/form/${tableID}/get`,
    {
      ref: buildQueryRef(schema),
      query: {
        term: { _id: rowID },
      },
    },
  ).then(({ entity }) => {
    if (!entity) {
      // 只查 schema 的时候不要 reject
      return {};
    }

    return entity;
  });
}

export async function fetchOneFormDataWithSchema(
  appID: string,
  tableID: string,
  rowID: string,
): Promise<{ schemaRes?: GetTableSchemaResponse, record?: Record<string, any> }> {
  const schemaRes = await getTableSchema(appID, tableID);
  if (!schemaRes?.schema) {
    return {};
  }

  const record = await findOneFormDataRequest(appID, tableID, rowID, schemaRes.schema);
  return { schemaRes, record };
}

type GetTableSchemaResponse = null | { config: any; schema: ISchema; id: string, tableID: string };

export function getTableSchema(appID: string, tableID: string): Promise<GetTableSchemaResponse> {
  const path = window.SIDE === 'home' ?
    `/api/v1/form/${appID}/home/schema/${tableID}` :
    `/api/v1/form/${appID}/m/table/getByID`;

  return httpClient<GetTableSchemaResponse>(path, { tableID });
}

export function saveTableSchema(
  appID: string, tableID: string, schema: ISchema, source?: SchemaSource,
): Promise<unknown> {
  return httpClient(
    `/api/v1/form/${appID}/m/table/create`,
    { tableID, schema, source },
  );
}

export type FormDataRequestCreateParams = {
  method: 'create';
  entity: any;
}

export type FormDataRequestUpdateParams = {
  method: 'update';
  conditions?: {
    condition: Array<{ key: string; op: string; value: Array<string | number>; }>;
    tag?: 'and' | 'or';
  };
  entity: any;
  ref?: FormDataRequestUpdateParamsRef;
}

export type FormDataListResponse = { entities: Record<string, any>[]; total: number };

export type RefData = {
  updated?: Record<string, any>[];
  new?: (Record<string, any> | string)[];
  deleted?: string[];
}

export type FormDataRequestUpdateParamsRef = Record<string, RefData & {
  type: 'sub_table' | 'foreign_table' | 'serial' | 'aggregation' | 'associated_records';
  appID?: string;
  tableID?: string;
  sourceFieldId?: string;
  aggType?: string;
  fieldName?: string;
  query?: ESParameter | null;
}>;

export type FormDataResponse = { entity: Record<string, any>[]; errorCount: number; total: number };

export type FormDataBody = {
  entity?: Record<string, any>;
  ref?: FormDataRequestUpdateParamsRef;
}

export type FormDataListRequestParams = {
  query?: ESParameter;
  page?: number;
  size?: number;
  sort?: string[];
}

export function fetchFormDataList(
  appID: string,
  pageID: string,
  data: FormDataListRequestParams,
): Promise<FormDataListResponse> {
  return httpClient<Record<string, any>>(`/api/v1/form/${appID}/home/form/${pageID}/search`, {
    method: 'find',
    page: 1,
    size: 10,
    ...data,
  }).then((res) => {
    return { entities: res?.entities || [], total: res.total || 0 };
  });
}

export function createFormDataRequest(
  appID: string,
  tableID: string,
  params: FormDataBody,
): Promise<FormDataResponse> {
  return httpClient<FormDataResponse>(
    `/api/v1/form/${appID}/home/form/${tableID}/create`,
    params,
  );
}

export function editFormDataRequest(
  appID: string,
  tableID: string,
  dataID: string,
  params: FormDataBody,
): Promise<FormDataResponse> {
  return httpClient<FormDataResponse>(
    `/api/v1/form/${appID}/home/form/${tableID}/update`,
    {
      ...params,
      query: {
        term: { _id: dataID },
      },
    },
  );
}

export function delFormDataRequest(
  appID: string,
  tableID: string,
  rowIDs: string[],
): Promise<Record<string, any>> {
  return httpClient<FormDataResponse>(
    `/api/v1/form/${appID}/home/form/${tableID}/delete`,
    {
      query: {
        terms: { _id: rowIDs },
      },
    },
  );
}

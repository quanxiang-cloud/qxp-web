import { QueryFunctionContext } from 'react-query';
import { isEmpty } from 'lodash';
import { and, pick } from 'ramda';

import { getTableSchema } from '@lib/http-client-form';
import httpClient from '@lib/http-client';
import { schemaToOptions, SchemaToOptionsOptions } from '@lib/schema-convert';
import { SYSTEM_FIELDS } from '@c/form-builder/constants';

import { Operation } from '../type';
import { SYSTEM_OPERATOR_PERMISSION, CUSTOM_OPERATOR_PERMISSION } from '../utils/constants';

interface SchemaResponse {
  schema?: {
    properties?: {
      [key: string]: ISchema;
    }
  }
}

export type FormFieldOption = {
  label: string;
  value: string;
  isSystem: boolean;
  isLayout: boolean;
  path: string;
  read: boolean;
  write: boolean;
  invisible: boolean;
  editable: boolean;
};

export async function getFormFieldSchema({ queryKey }: QueryFunctionContext): Promise<ISchema> {
  const data = await httpClient<SchemaResponse | null>(
    `/api/v1/form/${queryKey[2]}/m/table/getByID`, { tableID: queryKey[1] });
  return data?.schema ?? {};
}

async function rebuildSchema(_schema: ISchema): Promise<ISchema> {
  const isSubTable = _schema['x-component'] === 'SubTable';
  const props = _schema['x-component-props'];
  const isForeignSubTable = props?.subordination === 'foreign_table';
  const { tableID, appID, columns } = props ?? {};
  if (and(isSubTable, isForeignSubTable)) {
    const tableSchema = await getTableSchema(appID, tableID);
    if (!tableSchema) {
      return _schema;
    }
    const keepColumns = columns.filter((column: string) => !SYSTEM_FIELDS.includes(column));
    tableSchema.schema.properties = pick(keepColumns, tableSchema.schema.properties);
    Object.assign(_schema, { items: tableSchema.schema });
    return _schema;
  }
  const { properties = {} } = _schema;
  if (isEmpty(properties)) {
    return _schema;
  }
  for (const [key, schema] of Object.entries(properties)) {
    Object.assign(_schema.properties, { [key]: await rebuildSchema(schema) });
  }
  return _schema;
}

export async function getFormFieldOptions(
  { queryKey, meta }: QueryFunctionContext, parseSubTableForeign?: boolean,
): Promise<{
  options: FormFieldOption[],
  schema: ISchema,
}> {
  let schema = await getFormFieldSchema({ queryKey, meta });

  if (parseSubTableForeign) {
    schema = await rebuildSchema(schema);
  }

  return {
    options: schemaToOptions(schema, queryKey[3] as SchemaToOptionsOptions),
    schema,
  };
}

const operationList = { system: SYSTEM_OPERATOR_PERMISSION, custom: CUSTOM_OPERATOR_PERMISSION };
export function getOperationList({ queryKey }: QueryFunctionContext): Promise<{
  system?: Operation[];
  custom: Operation[];
}> {
  return new Promise((r) => {
    const type = queryKey[1];
    return r({
      system: operationList.system.filter(({ only }) => !only || only === type),
      custom: operationList.custom.filter(({ only }) => !only || only === type),
    });
  });
}

export function getFlowVariables(flowID: string): Promise<Array<ProcessVariable>> {
  return httpClient.get(`/api/v1/pipeline/${flowID}`);
}

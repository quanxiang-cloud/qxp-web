import { QueryFunctionContext } from 'react-query';
import httpClient from '@lib/http-client';
import { schemaToOptions } from '@lib/schema-convert';

import { Operation } from '../type';
import { SYSTEM_OPERATOR_PERMISSION, CUSTOM_OPERATOR_PERMISSION } from '../utils/constants';

interface SchemaResponse {
  schema?: {
    properties?: {
      [key: string]: ISchema;
    }
  }
}

export type Option = {
  label: string;
  value: string;
  children?: Option[];
  type?: string;
  isSystem?: boolean;
};

export async function getFormFieldSchema({ queryKey }: QueryFunctionContext): Promise<{
  properties?: { [key: string]: ISchema; } | undefined;
}> {
  const data = await httpClient<SchemaResponse | null>(
    `/api/v1/form/${queryKey[2]}/m/table/getByID`, { tableID: queryKey[1] });
  return data?.schema ?? {};
}

export async function getFormFieldOptions({ queryKey }: QueryFunctionContext): Promise<{
  options: Option[],
  schema: ISchema,
}> {
  const schema = await getFormFieldSchema({ queryKey });
  return {
    options: schemaToOptions(schema),
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
  return httpClient(`/api/v1/flow/getVariableList?id=${flowID}`);
}

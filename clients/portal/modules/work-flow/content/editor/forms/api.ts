import { QueryFunctionContext } from 'react-query';

import httpClient from '@lib/http-client';

import { Operation } from '../type';
import { SYSTEM_OPERATOR_PERMISSION, CUSTOM_OPERATOR_PERMISSION } from '../utils/constants';

export type Option = {
  label: string;
  value: string;
  children?: Option[];
  type?: string;
  isSystem?: boolean;
};

export type Options = Option[];

interface SchemaResponse {
  schema?: {
    properties?: {
      [key: string]: ISchema;
    }
  }
}

export async function getFormFieldSchema({ queryKey }: QueryFunctionContext): Promise<{
  properties?: { [key: string]: ISchema; } | undefined;
}> {
  const data = await httpClient<SchemaResponse | null>(
    `/api/v1/form/${queryKey[2]}/m/table/getByID`, {
      tableID: queryKey[1],
    });
  return data?.schema ?? {};
}

export async function getFormFieldOptions({ queryKey }: QueryFunctionContext): Promise<{
  options: Options,
  schema: ISchema,
}> {
  const schema = await getFormFieldSchema({ queryKey });
  function parseFormFieldOptions(schema: ISchema = {}): Option[] {
    return Object.entries(schema.properties ?? {}).reduce((prev: Option[], [id, value]) => {
      prev.push({
        label: value.title as string,
        value: id,
        type: value.type as string,
        isSystem: (value as ISchema)['x-internal']?.isSystem,
      });
      return prev;
    }, []);
  }
  return {
    options: parseFormFieldOptions(schema ?? {}),
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

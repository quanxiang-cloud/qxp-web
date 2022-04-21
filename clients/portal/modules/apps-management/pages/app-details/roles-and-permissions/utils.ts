import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { Spec } from '@one-for-all/api-spec-adapter';

import httpClient from '@lib/http-client';
import { TreeNode } from '@c/headless-tree/types';

import { fetchApiAuthDetails } from './api';
import { INIT_INPUT_SCHEMA, SCOPE } from './constants';
import { BodyParameter, Parameter, QueryParameter } from '@lib/api-adapter/swagger-schema-official';

type getAddAndRemovePersonResult = {
  newScopes: DeptAndUser[],
  addAndRemoveScope: {
    add: DeptAndUser[],
    removes: string[]
  }
}

export function getScopeQuery(type: number, ids: string[]): string {
  const query = type === SCOPE.DEP ?
    `{query(ids:${JSON.stringify(ids)}){departments{id,name}}}` :
    `{query(ids:${JSON.stringify(ids)}){users{id,email,name,phone,departments{id,name}}}}`;
  return query;
}

export function getAddAndRemovePerson(
  oldScopes: DeptAndUser[],
  deptList: EmployeeOrDepartmentOfRole[],
  employees: EmployeeOrDepartmentOfRole[]): getAddAndRemovePersonResult {
  const newScopes: DeptAndUser[] = [...deptList, ...employees].map((scope) => {
    return {
      type: scope.type,
      id: scope.id,
      name: scope.ownerName,
    };
  });
  const deletes: DeptAndUser[] = oldScopes.filter((member: { id: string; }) => {
    return !newScopes.find((m) => m.id === member.id);
  });
  const adds: DeptAndUser[] = newScopes.filter((member) => {
    return !oldScopes.find((m: { id: string; }) => m.id === member.id);
  });

  const addAndRemoveScope = {
    add: adds,
    removes: deletes?.map(({ id }: { id: string }) => id),
  };

  return { newScopes, addAndRemoveScope };
}

export function useQueryFetchAPiAuth(
  appID: string,
  data: {roleID: string, path: string, uri: string},
  options?: UseQueryOptions<APIAuth, Error>,
): UseQueryResult<APIAuth, Error> {
  return useQuery<APIAuth, Error>(
    'FETCH_API_DETAILS',
    () => fetchApiAuthDetails(appID, data),
    options,
  );
}

type QueryRequestNodeApiInputBody = {
  docType: 'raw' | 'swag' | 'curl' | 'javascript' | 'python'
  titleFirst?: boolean,
  _hide?: any,
  _signature?: any,
}

type QueryAPIDocResponse = undefined | {
  apiPath: string,
  doc: Spec,
  docType: string,
  title: string
}

export function useQueryAPIDoc(
  input: {path: string, body: QueryRequestNodeApiInputBody},
  options?: UseQueryOptions<QueryAPIDocResponse, Error>,
): UseQueryResult<QueryAPIDocResponse, Error> {
  return useQuery<QueryAPIDocResponse, Error>(
    ['API_DOC', input.path],
    (): Promise<QueryAPIDocResponse> => {
      if (options?.enabled === false) {
        return Promise.resolve(undefined);
      }
      return httpClient<QueryAPIDocResponse>(
        `/api/v1/polyapi/doc/${input.path.slice(1)}`, input.body);
    },
    options,
  );
}

export function turnParamsAsBodyPrams(parameters: Array<Parameter>): any {
  const found = parameters.find((param) => param.in === 'body') as BodyParameter;
  const inputSchema: SwagFieldSchema = found?.schema ? found?.schema : INIT_INPUT_SCHEMA;
  parameters.forEach((params) => {
    if (params.in === 'query') {
      const id = (params as QueryParameter).name;
      const _properties = { type: params.type, in: params.in };
      (inputSchema.properties || {})[id] = { ..._properties };
    }
  });
  return inputSchema;
}

export function fieldsTreeToParams(
  rootNode?: TreeNode<TreeField>,
): { [propertyName: string]: SwagFieldSchema; } {
  if (!rootNode) {
    return {};
  }

  const _params: { [propertyName: string]: SwagFieldSchema; } = {};
  rootNode.children?.forEach((child) => {
    const { data, id } = child;
    const condition = data?.acceptable || false;
    if (condition) {
      if (!data.properties) {
        _params[id] = { type: data.type };
        return;
      }
      _params[id] = {
        type: data.type,
        properties: fieldsTreeToParams(child),
      };
    }
  });
  return _params;
}


import { TreeNode } from '@c/headless-tree/types';

import { APIDocResponse } from './api';

import { INIT_INPUT_SCHEMA, PARAMS_IN_BODY_METHOD, SCOPE } from './constants';
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

export function getParamByMethod(method: string, parameters: Array<Parameter>): SwagField {
  if (PARAMS_IN_BODY_METHOD.includes(method)) {
    const bodyParameter = parameters.find((param): param is BodyParameter => param.in === 'body');
    return bodyParameter?.schema || INIT_INPUT_SCHEMA;
  }

  const _properties = parameters
    .filter((param): param is QueryParameter => param.in === 'query')
    .reduce((acc: { [propertyName: string]: SwagField }, params) => {
      const id = params.name;
      const _properties = { type: params.type, in: params.in };

      acc[id] = { type: params.type, in: params.in };
      return acc;
    }, {});

  return { type: 'object', properties: _properties };
}

export function fieldsTreeToParams(
  rootNode?: TreeNode<SwagField>,
): { [propertyName: string]: SwagSchema; } {
  if (!rootNode) {
    return {};
  }

  const _params: { [propertyName: string]: SwagSchema } = {};
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

export function findSchema(apiDoc: APIDocResponse): {
  inputSchema: SwagSchema | undefined,
  outputSchema: SwagSchema | undefined
} {
  const [method, operation] = Object.entries(Object.values(apiDoc.doc.paths)[0])[0];
  const inputSchema = getParamByMethod(method, operation.parameters || []);
  const outputSchema = Object.values(Object.values(apiDoc.doc.paths)[0])[0].responses?.[200]?.schema;
  return {
    inputSchema,
    outputSchema,
  };
}


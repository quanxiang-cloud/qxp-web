import { RawResponse } from '@one-for-all/api-spec-adapter';
import { Res } from '.';
import type { Spec, Operation } from './swagger-schema-official';

import type { APISpecAdapter, AjaxConfig, FetchParams } from './types';
import { indexOperation, join, toKeyPathPair } from './utils';

type Options = {
  __disableResponseAdapter?: boolean;
}

export default class SwaggerSpecAdapter implements APISpecAdapter {
  options: Options | undefined;
  spec: Spec;
  operationMap: Record<string, Operation>;

  constructor(spec: Spec, options?: Options) {
    this.operationMap = indexOperation(spec);
    this.spec = spec;
    this.options = options;
  }

  build(apiID: string, fetchParams?: FetchParams): AjaxConfig | undefined {
    const [method, path] = apiID.split(':');
    const operation: Operation = this.operationMap[apiID];

    if (!operation) {
      throw new Error(`can not find operation for path: ${path}, method: ${method}.`);
    }

    let url = join(this.spec.basePath || '', path);
    const queryParams: Record<string, any> = {};
    const headers: Record<string, any> = {};
    // todo return undefined and log error message
    // when the params do not meet the api requirements
    operation.parameters?.forEach((p) => {
      if ('$ref' in p) {
        // TODO: support reference object
        return;
      }

      if (p.in === 'path' && fetchParams?.params?.[p.name]) {
        // if (p.required && fetchParams?.params?.[p.name] === undefined) {
        //   throw new Error(`parameter '${p.name}' required in path for ${operationID}`);
        // }

        url = url.replace(`{${p.name}}`, fetchParams.params[p.name]);
      }

      if (p.in === 'query' && fetchParams?.params?.[p.name] !== undefined) {
        if (typeof fetchParams.params[p.name] === 'object') {
          const pairs = toKeyPathPair(fetchParams.params[p.name], p.name);
          pairs.forEach(([k, v]) => {
            queryParams[k] = v;
          });
          return;
        }

        queryParams[p.name] = fetchParams.params[p.name];
      }

      if (p.in === 'header' && fetchParams?.params?.[p.name] !== undefined) {
        headers[p.name] = fetchParams.params[p.name];
      }
    });

    headers['x-proxy'] = 'API';

    return { method, url, queryParams, headers, body: fetchParams?.body };
  }

  responseAdapter({ body, error }: RawResponse): Res {
    if (this.options?.__disableResponseAdapter) {
      return { result: body, error };
    }

    if (error || !body) {
      return { result: body, error };
    }

    // @ts-ignore
    if (body.code !== 0) {
      // @ts-ignore
      const e = new Error(body.msg);
      // @ts-ignore
      if (body.data) {
        // @ts-ignore
        Object.assign(e, { data: body.data });
      }
      return { result: undefined, error: e };
    }

    // @ts-ignore
    return { result: body.data, error: undefined };
  }
}

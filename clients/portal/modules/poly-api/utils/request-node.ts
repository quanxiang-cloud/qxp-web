import { isEmpty } from 'lodash';

import { ApiDetails } from '../effects/api/poly';

function parsePathParam(url: string): Record<string, any> {
  const pathArr = url.split('/:');
  pathArr.shift();
  if (!isEmpty(pathArr)) {
    return {
      path: pathArr.map((path: string) => {
        return { name: path.split('/')[0].split('?')[0], required: true };
      }),
    };
  }

  return {};
}

type ApiDocInput = {
  title?: string;
  name: string;
  mock?: string;
  data: any;
  required?: boolean;
  desc?: string;
  type: string;
  in: 'header' | 'body' | 'query';
}

export function convertToParamsConfig(apiData: ApiDetails | undefined): any[] {
  if (apiData) {
    const paramsConfig: any = {};
    const { url, input } = apiData.doc;

    input.inputs.forEach((apiDocInput: ApiDocInput) => {
      const { title, name } = apiDocInput;
      paramsConfig[apiDocInput.in] = paramsConfig[apiDocInput.in] || [];
      paramsConfig[apiDocInput.in].push({ title, name });
    });

    return Object.assign(parsePathParam(url), paramsConfig);
  }

  return [];
}

export function addNodeNamePrefix2PolyNodeInput(
  inputs: POLY_API.PolyNodeInput[], prefix: POLY_API.PolyNodeInput,
): POLY_API.PolyNodeInput {
  prefix.data = inputs;
  return prefix;
}

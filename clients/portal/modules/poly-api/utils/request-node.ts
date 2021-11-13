import { isEmpty } from 'lodash';

import { RawApiDocDetail } from '../effects/api/poly';

function parseParamOfPath(url: string): Record<string, any> {
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

function findAvailableBodyParams(data: any[], path?: string): any[] {
  return data.reduce<any[]>((bodyInputs, input, index) => {
    if (input.type !== 'object' && input.type !== 'array' && input.type !== 'timestamp') {
      bodyInputs.push({ title: input.title, name: input.name, required: input.required, path: path ? `${path}.${index}` : index });
    } else {
      input.data && bodyInputs.push(...findAvailableBodyParams(input.data, index.toString()));
    }

    return bodyInputs;
  }, []);
}

export function convertToParamsConfig(apiData: RawApiDocDetail | undefined): any[] {
  if (apiData) {
    const paramsConfig: any = {};
    const { url, input } = apiData.doc;

    input.inputs.forEach((apiDocInput: ApiDocInput) => {
      const { title, name, required } = apiDocInput;
      paramsConfig[apiDocInput.in] = paramsConfig[apiDocInput.in] || [];
      if (apiDocInput.in === 'body' && apiDocInput.data.length) {
        paramsConfig[apiDocInput.in] = paramsConfig[apiDocInput.in].concat(
          findAvailableBodyParams(apiDocInput.data),
        );
      }
      paramsConfig[apiDocInput.in].push({ title, name, required });
    });

    return Object.assign(parseParamOfPath(url), paramsConfig);
  }

  return [];
}
export function addNodeNamePrefix2PolyNodeInput(
  inputs: POLY_API.PolyNodeInput[], prefix: POLY_API.PolyNodeInput,
): POLY_API.PolyNodeInput {
  prefix.data = inputs;
  return prefix;
}

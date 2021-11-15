import { isEmpty } from 'lodash';

import { RawApiDetail, RawApiDocDetail } from '../effects/api/poly';

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
    const paramPath = path ? `${path}.data[${index}]` : `body.data[${index}]`;

    if (input.type !== 'object' && input.type !== 'array' && input.type !== 'timestamp') {
      bodyInputs.push({ title: input.title, name: input.name, required: input.required, path: paramPath });
    } else {
      input.data && bodyInputs.push(...findAvailableBodyParams(input.data, paramPath));
    }

    return bodyInputs;
  }, []);
}

export function mapNamespacePathsToLabelValue1(namespacePath: Array<any> | null): any {
  if (!namespacePath) {
    return;
  }

  return namespacePath.map(({ name, parent, children }: any) => {
    return {
      label: name,
      value: `${parent}/${name}`,
      path: `${parent}/${name}`,
      isLeaf: false,
      childrenData: mapNamespacePathsToLabelValue1(children),
    };
  });
}

export function mapNamespacePathsToLabelValue(namespacePath: Array<any> | null, path?: string): any {
  if (!namespacePath) {
    return;
  }

  return namespacePath.map(({ name, parent, children }: any, index: number) => {
    const optionPath = path ? `${path}.${index}` : `${index}`;

    return {
      label: name,
      value: `${parent}/${name}`,
      children: children ? mapNamespacePathsToLabelValue(children, optionPath) :
        [{ label: '暂无API', value: '', isLeaf: true, disabled: true }],
      path: optionPath,
    };
  });
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
        return;
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

export function convertRawApiListToOptions(rawApiList: RawApiDetail[]) {
  return rawApiList.length ? rawApiList.map(({ name, fullPath }: RawApiDetail) => {
    return {
      label: name,
      value: fullPath,
      path: fullPath,
      isLeaf: true,
    };
  }) : [{ label: '暂无api', value: '', isLeaf: true, disabled: true }];
}

export function getChildrenOfCurrentSelectOption(currentChildrenData: any): any {
  if (!currentChildrenData) {
    return null;
  }

  return currentChildrenData.map(({ name, children, parent }: any) => {
    return {
      label: name,
      value: name,
      childrenData: children,
      isLeaf: false,
      path: `${parent}/${name}`,
    };
  });
}

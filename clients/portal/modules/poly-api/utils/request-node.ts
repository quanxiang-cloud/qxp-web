import { isArray, isEmpty, isString, omit } from 'lodash';

import { RawApiDetail } from '../effects/api/raw';
import { isObjectField } from './object-editor';

export function parseParamOfPath(url: string): Record<string, ParamsConfig[]> {
  const pathArr = url.split('/:');
  pathArr.shift();
  if (isEmpty(pathArr)) {
    return { path: [] };
  }
  const config = pathArr.map((path: string, index: number) => {
    return {
      type: 'string',
      name: path.split('/')[0].split('?')[0],
      data: '',
      in: 'path',
      required: true,
      path: `${index}`,
    };
  });
  return { path: config };
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

type ParamsConfig = Omit<POLY_API.PolyNodeInput, 'data' | 'type' | 'in'> & {
  type: string;
  data: string;
  path: string;
  in: string;
}

function shouldConvert(name: string): boolean {
  return !['Signature', 'Access-Token', '_signature'].includes(name);
}
export function convertToParamsConfig(
  originalInputs: POLY_API.PolyNodeInput[],
  parentPath = '',
  parentIn = 'body',
  acc: Record<string, ParamsConfig[]> = {},
): Record<string, ParamsConfig[]> {
  originalInputs.forEach((apiDocInput: POLY_API.PolyNodeInput, index: number) => {
    const currentPath = parentPath ? `${parentPath}.${index}` : `${index}`;
    const { type, data, name } = apiDocInput;
    const currentIn = apiDocInput.in || parentIn;
    acc[currentIn] = acc[currentIn] || [];
    if (!isObjectField(type) && shouldConvert(name)) {
      acc[currentIn].push({
        ...omit(apiDocInput, 'data'), data: isString(data) ? data : '', path: currentPath,
      });
    } else if (isArray(apiDocInput.data)) {
      shouldConvert(name) && convertToParamsConfig(apiDocInput.data, `${currentPath}.data`, currentIn, acc);
    }
  });
  return acc;
}

export type PolyApiSelectorOption = {
  label: string;
  value: string;
  path: string;
  isLeaf: boolean;
  disabled: boolean;
}
export function convertRawApiListToOptions(rawApiList: RawApiDetail[]): PolyApiSelectorOption[] {
  if (!rawApiList.length) {
    return [{ label: '暂无api', value: '', path: '', isLeaf: true, disabled: true }];
  }
  return rawApiList.map(({ name, fullPath }: RawApiDetail) => {
    return {
      label: name,
      value: fullPath,
      path: fullPath,
      isLeaf: true,
      disabled: false,
    };
  });
}

const Title_Map: Record<string, string> = {
  inner: '平台API',
  customer: '第三方API',
};
export function getChildrenOfCurrentSelectOption(currentChildrenData: any): any {
  if (!currentChildrenData) {
    return null;
  }

  return currentChildrenData.map(({ name, children, parent, title }: any) => {
    return {
      label: title ? title : (Title_Map[name] || name),
      value: name,
      childrenData: children,
      isLeaf: false,
      path: `${parent}/${name}`,
    };
  });
}

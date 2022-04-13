import { isEmpty, isString, omit } from 'lodash';

import { DirectoryChild } from '@lib/api-collection';
import { isApi } from '@lib/api-collection/utils';

import { isObjectField } from './object-editor';
import { RawApiDetail } from '../effects/api/raw';
import { PLACEHOLDER_OPTION } from '../constants';

type ParamsConfig = Omit<POLY_API.PolyNodeInput, 'data' | 'type' | 'in'> & {
  type: string;
  data: string;
  path: string;
  in: string;
  arrayParent?: { name: string, title: string };
}

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

export function convertToParamsConfig(
  originalInputs: POLY_API.PolyNodeInput[],
  parentPath = '',
  parentIn = 'body',
  acc: Record<string, ParamsConfig[]> = {},
): Record<string, ParamsConfig[]> {
  originalInputs.forEach((apiDocInput: POLY_API.PolyNodeInput, index: number) => {
    const currentPath = parentPath ? `${parentPath}.${index}` : `${index}`;
    const { type, data } = apiDocInput;
    const currentIn = apiDocInput.in || parentIn;
    acc[currentIn] = acc[currentIn] || [];
    if (type !== 'object') {
      const currentInput = {
        ...omit(apiDocInput, 'data'),
        path: currentPath,
        data: isString(data) ? data : '',
      } as ParamsConfig;

      acc[currentIn].push(currentInput);
    }

    if (type === 'object') {
      convertToParamsConfig(
        apiDocInput.data as POLY_API.PolyNodeInput[], `${currentPath}.data`, currentIn, acc,
      );
    }
  });

  return acc;
}

export type ApiCascaderOption = {
  label: string;
  value: string;
  children: ApiCascaderOption[] | undefined;
  isLeaf: boolean;
  path: string;
  childrenData?: any;
  disabled?: boolean;
}

function mergeApiListToChildNameSpace(
  childNameSpace: ApiCascaderOption[] | undefined, rawApiList: RawApiDetail[],
): ApiCascaderOption[] {
  if (!rawApiList.length && !childNameSpace) {
    return PLACEHOLDER_OPTION;
  }

  return (childNameSpace || []).concat(rawApiList.map(({ title, name, fullPath }: RawApiDetail) => {
    return {
      label: title || name.split('.').shift() || '',
      value: fullPath,
      path: fullPath,
      children: undefined,
      isLeaf: true,
      disabled: false,
    };
  }));
}

const Title_Map: Record<string, string> = {
  inner: '平台API',
  customer: '第三方API',
};
export function getChildrenOfCurrentSelectOption(
  currentChildren: DirectoryChild[],
  apiNamespacePath: string,
): ApiCascaderOption[] {
  return currentChildren.map((currentChild) => {
    if (isApi(currentChild)) {
      const { name, title, pathType, fullPath } = currentChild;
      return {
        label: title ? title : (Title_Map[name] || name),
        value: name,
        children: undefined,
        isLeaf: true,
        path: fullPath,
        pathType,
      };
    } else {
      const { name, title, pathType, children, parent } = currentChild;
      let _children: ApiCascaderOption[] | undefined;
      if (children && children.length) {
        _children = getChildrenOfCurrentSelectOption(children, apiNamespacePath);
      } else if (apiNamespacePath === `${parent}/${name}`) {
        _children = PLACEHOLDER_OPTION;
      }
      return {
        label: title ? title : (Title_Map[name] || name),
        value: name,
        children: _children,
        isLeaf: false,
        path: `${parent}/${name}`,
        pathType,
      };
    }
  });
}

function omitNodeInputProperties(
  inputs: POLY_API.PolyNodeInput[], properties: string[],
): POLY_API.PolyNodeInput[] {
  return inputs.map((input: POLY_API.PolyNodeInput) => {
    const _input = omit(input, properties) as POLY_API.PolyNodeInput;
    if (isObjectField(input.type)) {
      _input.data = omitNodeInputProperties(_input.data as POLY_API.PolyNodeInput[], properties);
      return _input;
    }

    return _input;
  });
}

function reduceNoiseNodeInputData(inputs: POLY_API.PolyNodeInput[]): POLY_API.PolyNodeInput[] {
  const _inputs: POLY_API.PolyNodeInput[] = [];
  inputs.forEach((input) => {
    if ('$appendix$' in input) {
      return;
    }

    if (input.name === 'root' || !input.name) {
      (input.data as POLY_API.PolyNodeInput[]).filter((input) => {
        return '$appendix$' in input ? false : true;
      }).map((input) => {
        if (!input.in) {
          input.in = 'body';
        }

        _inputs.push(input);
        return input;
      });
      return;
    }

    _inputs.push(input);
  });

  return _inputs;
}

export function filterPolyApiInputs(inputs: POLY_API.PolyNodeInput[]): POLY_API.PolyNodeInput[] {
  const _inputs = reduceNoiseNodeInputData(inputs);
  return omitNodeInputProperties(_inputs, ['mock', 'desc']);
}

function appendApiListToTargetOption(
  option: ApiCascaderOption, targetOptionPath: string, apiList: RawApiDetail[],
): ApiCascaderOption {
  if (option.path === targetOptionPath) {
    return {
      ...option,
      children: mergeApiListToChildNameSpace(option.children, apiList),
      childrenData: (option.childrenData || []).concat(apiList),
    };
  }

  if (option.children) {
    option.children = option.children.map((option: ApiCascaderOption) => {
      return appendApiListToTargetOption(option, targetOptionPath, apiList);
    });
  }

  return option;
}

export function mergeApiListToOptions(
  options: ApiCascaderOption[], targetOptionPath: string, apiList: RawApiDetail[],
): ApiCascaderOption[] {
  return options.map((option) => {
    return appendApiListToTargetOption(option, targetOptionPath, apiList);
  });
}

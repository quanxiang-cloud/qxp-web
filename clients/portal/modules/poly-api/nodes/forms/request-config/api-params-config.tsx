import React, { forwardRef, ForwardedRef, useImperativeHandle, useRef, useEffect } from 'react';
import { lensPath, set, view, values } from 'ramda';
import { isArray, first } from 'lodash';

import Icon from '@c/icon';
import FormulaEditor, { RefProps, CustomRule } from '@c/formula-editor';
import { convertToParamsConfig, parseParamOfPath } from '@polyApi/utils/request-node';

import './params.scss';

type Props = {
  value: POLY_API.PolyNodeInput[];
  url: string;
  onChange: (value: POLY_API.PolyNodeInput[]) => void;
  customRules: CustomRule[];
  validating?: boolean;
  initValue?: POLY_API.PolyNodeInput[];
  isWebhook?: boolean;
}

export type RefType = {
  getCurrent: () => RefProps | null;
  validate: () => never | void;
}

function ApiParamsConfig(
  { value, onChange, customRules, url, validating, initValue, isWebhook }: Props,
  ref: ForwardedRef<RefType | undefined>,
): JSX.Element {
  const formulaRefs = useRef<Record<string, RefProps>>({});
  const currentFormulaEditorRef = useRef<RefProps | null>(null);
  const errorsRef = useRef<Record<string, string>>({});
  const changedRef = useRef<Record<string, boolean>>({});

  useImperativeHandle(ref, () => ({
    getCurrent: () => currentFormulaEditorRef.current,
    validate: () => {
      const errorMessage = first(values(errorsRef.current).filter(Boolean));
      if (errorMessage) {
        throw new Error(errorMessage);
      }
    },
  }));

  useEffect(() => {
    const path = parseParamOfPath(url).path as unknown as POLY_API.PolyNodeInput[];
    if (!path.length || value.some((v) => v.in === 'path')) {
      return;
    }
    onChange(path.concat(value));
  }, [url, value]);

  if (!isArray(value)) {
    throw new Error('array');
  }

  const valueWithPath = convertToParamsConfig(value);
  const polyParams = Object.entries(valueWithPath);

  function toNumber(value: string): number | string {
    return /^\d+$/.test(value) ? parseInt(value) : value;
  }

  function initError(path: string, name: string): void {
    errorsRef.current[path] = `请输入${name}配置`;
  }

  function getDistValue(path: string, value: any, val: any): any {
    const dataLens = lensPath(`${path}.data`.split('.').map(toNumber));
    const typeLens = lensPath(`${path}.type`.split('.').map(toNumber));
    view(dataLens, value);
    const newInputs = set(dataLens, val, value);
    const currentType = view(typeLens, newInputs);

    let distValue: any = newInputs;
    if (val.indexOf('$') !== -1 && currentType !== 'direct_expr') {
      distValue = set(typeLens, 'direct_expr', distValue);
    } else if (val.indexOf('$') === -1 && currentType === 'number') {
      distValue = set(dataLens, toNumber(val), distValue);
    } else if (val.indexOf('$') === -1 && currentType === 'direct_expr') {
      const originalType = view(typeLens, initValue);
      if (!originalType) return distValue;
      distValue = set(typeLens, originalType, distValue);
      if (originalType === 'number') {
        distValue = set(dataLens, toNumber(val), distValue);
      }
    }

    return distValue;
  }

  function handleFormulaChange(path: string, name: string, required: boolean, oldVal?: string) {
    return (val: string) => {
      if (val === oldVal) {
        return;
      }
      handleSetCurrentFormulaRef(path)();
      const distValue = getDistValue(path, value, val);
      onChange(distValue);
      changedRef.current[path] = true;
      if (required) {
        errorsRef.current[path] = !val ? `请输入${name}配置` : '';
      }
    };
  }

  function handleFormulaBlur(path: string, name: string, required: boolean, data: string) {
    return () => {
      handleFormulaChange(path, name, !!required)(data);
    };
  }

  function handleSetCurrentFormulaRef(path: string) {
    return () => {
      currentFormulaEditorRef.current = formulaRefs.current[path];
    };
  }

  function handleSetFormulaRefs(path: string) {
    return (node: RefProps) => {
      formulaRefs.current[path] = node;
    };
  }

  return (
    <div className="p-12 flex-2 bg-gray-50 overflow-auto config-params-container">
      {!!polyParams?.length && polyParams.map(([type, params]) => {
        if (!params.length) {
          return;
        }

        return (
          <div key={type} className="my-20">
            <div className="pb-4 text-gray-900">{type.replace(/^\S/, (s: string) => s.toUpperCase())}</div>
            <div className="config-param">
              {params.map(({ path, name, title, data, required, arrayParent }) => {
                !data && required && initError(path, name);
                return (
                  <div
                    key={path}
                    className="flex justify-between bg-white text-12"
                    onClick={handleSetCurrentFormulaRef(path)}
                  >
                    <div className="flex items-center justify-between w-142 p-8 border-r-1">
                      <div className="flex-1 truncate relative">
                        <span>{!title ? arrayParent?.title : title}</span>
                        <span className="mx-4 text-gray-400">{!name ? arrayParent?.name : name}</span>
                        {required && <span className="text-red-600 absolute top-0 right-0">*</span>}
                      </div>
                      <Icon className="ml-8" name="arrow_left_alt" />
                    </div>
                    <div className="flex flex-col overflow-auto">
                      <FormulaEditor
                        help=""
                        ref={handleSetFormulaRefs(path)}
                        customRules={customRules}
                        value={data || ''}
                        className="node-formula-editor"
                        onChange={handleFormulaChange(path, name, !!required, data)}
                        onBlur={handleFormulaBlur(path, name, !!required, data)}
                        isWebhook={isWebhook}
                      />
                      {errorsRef.current[path] && (changedRef.current[path] || validating) && (
                        <span className="text-red-600 px-3 pb-3">{errorsRef.current[path]}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default forwardRef<RefType | undefined, Props>(ApiParamsConfig);

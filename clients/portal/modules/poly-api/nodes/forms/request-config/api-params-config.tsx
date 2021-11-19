import React, { forwardRef, ForwardedRef, useImperativeHandle, useRef, useEffect } from 'react';
import { lensPath, set, view } from 'ramda';
import { isArray } from 'lodash';

import Icon from '@c/icon';
import FormulaEditor, { RefProps, CustomRule } from '@c/formula-editor';
import { convertToParamsConfig, parseParamOfPath } from '@portal/modules/poly-api/utils/request-node';

type Props = {
  value: POLY_API.PolyNodeInput[];
  url: string;
  onChange: (value: POLY_API.PolyNodeInput[]) => void;
  customRules: CustomRule[];
}

export type RefType = { getCurrent: () => RefProps | null; }

function ApiParamsConfig(
  { value, onChange, customRules, url }: Props,
  ref: ForwardedRef<RefType | undefined>,
): JSX.Element {
  const formulaRefs = useRef<Record<string, RefProps>>({});
  const currentFormulaEditorRef = useRef<RefProps | null>(null);
  useImperativeHandle(ref, () => ({
    getCurrent: () => currentFormulaEditorRef.current,
  }));

  useEffect(() => {
    const path = parseParamOfPath(url).path as unknown as POLY_API.PolyNodeInput[];
    if (!path.length || value.some((v) => v.in === 'path')) {
      return;
    }
    onChange(path.concat(value));
  }, [url]);

  if (!isArray(value)) {
    throw new Error('array');
  }

  const valueWithPath = convertToParamsConfig(value);
  const polyParams = Object.entries(valueWithPath);

  function toNumber(value: string): number | string {
    return /^\d+$/.test(value) ? parseInt(value) : value;
  }

  function handleFormulaChange(path: string) {
    return (val: string) => {
      handleSetCurrentFormulaRef(path)();
      const dataLens = lensPath(`${path}.data`.split('.').map(toNumber));
      view(dataLens, value);
      const newInputs = set(dataLens, val, value);
      const typeLens = lensPath(`${path}.type`.split('.').map(toNumber));
      view(typeLens, newInputs);
      const distValue = set(typeLens, 'direct_expr', newInputs);
      onChange(distValue);
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
        return (
          <div key={type} className="my-20">
            <div className="pb-4 text-gray-900">{type.replace(/^\S/, (s: string) => s.toUpperCase())}</div>
            <div className="config-param">
              {params.map(({ title, name, required, path, data }) => {
                return (
                  <div
                    key={path}
                    className="flex justify-between"
                    onClick={handleSetCurrentFormulaRef(path)}
                  >
                    <div className="flex items-center justify-between w-142 p-8 flex-1 border-r-1">
                      <div className="flex-1 truncate">
                        <span>{title}</span>
                        <span className="mx-4 text-gray-400">{name}</span>
                        {required && <span className="text-red-600">*</span>}
                      </div>
                      <Icon className="ml-8" name="arrow_left_alt" />
                    </div>
                    {customRules.length ? (
                      <FormulaEditor
                        help=""
                        ref={handleSetFormulaRefs(path)}
                        customRules={customRules}
                        defaultValue={data}
                        className="node-formula-editor"
                        onChange={handleFormulaChange(path)}
                      />
                    ) : <div className="node-formula-editor"></div>}
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

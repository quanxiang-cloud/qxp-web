import React, { Fragment, forwardRef, ForwardedRef, useImperativeHandle, useRef } from 'react';
import { values } from 'ramda';
import { first } from 'lodash';

import { Input } from '@newFlow/content/editor/type';
import Icon from '@c/icon';
import FormulaEditor, { RefProps, CustomRule } from '@c/formula-editor';

import './style.scss';

interface Props {
  value: Input[];
  onChange: (
    id: string, key: string, value: string, type: 'header' | 'body' | 'query', index: number
  ) => void;
  onRemove: (id: string) => void;
  type: 'header' | 'body' | 'query';
  customRules: CustomRule[];
  onClick: () => void;
}

export type RefType = {
  getCurrent: () => RefProps | null;
  validate: () => never | void;
}

function SendBlock(
  { value = [], onChange, onRemove, type, customRules, onClick }: Props,
  ref: ForwardedRef<RefType | undefined>,
): JSX.Element {
  const currentFormulaEditorRef = useRef<RefProps | null>(null);
  const errorsRef = useRef<Record<string, string>>({});
  const formulaRefs = useRef<Record<string, RefProps>>({});
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

  function handleSetCurrentFormulaRef(id: string): void {
    currentFormulaEditorRef.current = formulaRefs.current[id];
  }

  function handleSetFormulaRefs(id: string) {
    return (node: RefProps) => {
      formulaRefs.current[id] = node;
    };
  }

  function handleChange(key: string, row: Input, val: string, index: number): void {
    if (!row.id) {
      return;
    }
    handleSetCurrentFormulaRef(row.id);
    onChange(row.id, key, val, type, index);
    if (key !== 'name') {
      return;
    }
    changedRef.current[row.id] = true;
    errorsRef.current[row.id] = !val ? '请输入参数名' : '';
  }

  function initError(id: string): void {
    errorsRef.current[id] = '请输入参数名';
  }

  return (
    <>
      <h1 className="mt-8 mb-4 text-gray-900 text-h6-no-color-weight">{type}</h1>
      <div className="bg-white border rounded-8 grid webhook-send-block" onClick={onClick}>
        <div className="webhook-send-block--key">key</div>
        <div className="webhook-send-block--value">value</div>
        {value.map((row, index) => {
          if (!row.id) {
            return null;
          }
          !row.name && initError(row.id);
          return (
            <Fragment key={row.id}>
              <div className="webhook-send-block--key flex justify-between items-center whitespace-nowrap">
                <input
                  value={row.name}
                  onChange={(e) => {
                    e.target.value !== row.name && handleChange('name', row, e.target.value, index);
                  }}
                  placeholder="新建参数"
                  className="border-none flex-1"
                />
                {errorsRef.current[row.id] && changedRef.current[row.id] && (
                  <span className="text-red-600 px-3 flex items-center">
                    {errorsRef.current[row.id]}
                  </span>
                )}
              </div>
              <div
                className="webhook-send-block--value flex justify-between items-center"
                onClick={() => handleSetCurrentFormulaRef(row.id || '')}
              >
                <FormulaEditor
                  help=""
                  ref={handleSetFormulaRefs(row.id)}
                  customRules={customRules}
                  value={row.data as string}
                  className="node-formula-editor"
                  onChange={(val) => val !== row.data && handleChange('data', row, val, index)}
                  onBlur={() => handleChange('data', row, row.data as string, index)}
                  isInsertEntityFromEmpty={true}
                  isWebhook={true}
                />
                {(index !== value.length - 1) && (
                  <Icon name="delete" clickable onClick={() => row.id && onRemove(row.id)} />
                )}
              </div>
            </Fragment>
          );
        })}
      </div>
    </>
  );
}

export default forwardRef(SendBlock);

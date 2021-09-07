import React, { useState, ChangeEvent, useEffect, createRef, Ref } from 'react';

import Toggle from '@c/toggle';
import Icon from '@c/icon';
import Tooltip from '@c/tooltip';
import { isCurrentNodeFirstLogicNode } from '@flow/content/editor/utils/node';
import type {
  Operation,
  OperationPermission as OperationPermissionType,
  FillInData,
} from '@flow/content/editor/type';

interface Props {
  label: string,
  operationData: OperationPermissionType,
  type: 'system' | 'custom',
  onChange: (value: Partial<FillInData>) => void;
}

export default function PermissionList({ label, operationData, type, onChange }: Props): JSX.Element | null {
  const operation = operationData[type];
  const [buttonTextRefs, setButtonTextRefs] = useState<Ref<HTMLInputElement>[]>([]);
  const isFirstLogicNode = isCurrentNodeFirstLogicNode();

  useEffect(() => {
    if (!operation?.length) {
      return;
    }
    setButtonTextRefs((buttonTextRefs) => {
      return Array(operation.length).fill(0).map((_, i) => {
        return buttonTextRefs[i] || createRef();
      });
    });
  }, [operation?.length]);

  function handleChange(operatorPermission: OperationPermissionType): void {
    onChange({ operatorPermission });
  }

  function onUpdateOperation(
    type: 'system' | 'custom',
    operation: Operation,
    value: Partial<Operation>,
  ): void {
    handleChange({
      ...operationData,
      [type]: operationData[type].map((o: Operation) => {
        if (operation === o) {
          return {
            ...o,
            ...value,
          };
        }
        return o;
      }),
    });
  }

  function handleButtonTextChange(type: 'system' | 'custom', op: Operation) {
    return (v: ChangeEvent<HTMLInputElement>) => onUpdateOperation(type, op, {
      text: v.target.value,
    });
  }

  function handleResetButtonText(type: 'system' | 'custom', op: Operation, index: number): () => void {
    return () => {
      if (buttonTextRefs[index]) {
        (buttonTextRefs[index] as any).current.value = op.name;
      }
      onUpdateOperation(type, op, {
        text: op.name,
      });
    };
  }

  function handleCheckReasonRequired(type: 'system' | 'custom', op: Operation) {
    return (checked: boolean) => onUpdateOperation(type, op, {
      reasonRequired: !!checked,
    });
  }

  if (!operation?.length) {
    return null;
  }

  return (
    <>
      <div className="text-caption-no-color text-gray-400 py-10 px-10 shadow-header">
        {label}
      </div>
      {operation.map((op, index) => {
        if (op.value === 'STEP_BACK' && isFirstLogicNode) {
          return null;
        }
        return (
          <div
            key={op.value || op.name}
            className="flex items-center justify-between px-10 py-16 shadow-header"
          >
            <div className="flex flex-1 justify-center">
              <Toggle
                disabled={!op.changeable}
                defaultChecked={op.enabled}
                onChange={(checked) => onUpdateOperation(type, op, {
                  enabled: !!checked,
                })}
              />
            </div>
            <div className="flex-1 text-left">{op.name}</div>
            <div className="relative flex flex-2 justify-center">
              {(op.text || op.name) && (
                <>
                  <input
                    ref={buttonTextRefs[index] as any}
                    className="w-full pl-12 py-8 pr-36"
                    maxLength={30}
                    defaultValue={op.text}
                    onChange={handleButtonTextChange(type, op)}
                  />
                  {op.text !== op.name && (
                    <Tooltip
                      position="top"
                      label="恢复默认"
                      relative={false}
                      wrapperClassName="absolute right-16 top-1/2 transform -translate-y-1/2"
                      labelClassName="whitespace-nowrap"
                    >
                      <Icon
                        name="refresh"
                        size={20}
                        className="cursor-pointer"
                        onClick={handleResetButtonText(type, op, index)}
                      />
                    </Tooltip>
                  )}
                  {
                    op.text === op.name && (
                      <Icon
                        name="refresh"
                        size={20}
                        disabled
                        className="cursor-not-allowed absolute right-16 top-1/2 transform
                            -translate-y-1/2"
                      />
                    )
                  }
                </>
              )}
            </div>
            {typeof op.reasonRequired !== 'undefined' ? (
              <div className="flex flex-1 justify-center">
                <Toggle
                  defaultChecked={op.reasonRequired}
                  onChange={handleCheckReasonRequired(type, op)}
                />
              </div>
            ) : <div className="flex-1 text-center">-</div>}
          </div>
        );
      })}
    </>
  );
}

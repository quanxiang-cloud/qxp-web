import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';

import Toggle from '@c/toggle';
import Icon from '@c/icon';
import Tooltip from '@c/tooltip';
import Loading from '@c/loading';
import ErrorTips from '@c/error-tips';

import { getOperationList } from '../../api';
import {
  SystemOperation,
  CustomOperation,
  OperationPermission as OperationPermissionType,
} from '../../../store';

interface Props {
  value: OperationPermissionType;
  onChange: (value: OperationPermissionType) => void;
  type?: 'approve' | 'fillIn';
}

export default function OperatorPermission({ value, onChange, type }: Props) {
  const { data, isLoading, isError } = useQuery(['GET_OPERATION_LIST', type], getOperationList);
  const [mergedOperations, setMergedOperations] = useState<OperationPermissionType>(value);

  useEffect(() => {
    if (data) {
      mergeOperation();
    }
  }, [data, value]);

  function mergeOperation() {
    const { custom, system } = value;
    const isCustomEmpty = !custom.length;
    const isSystemEmpty = !system.length;
    data?.custom.forEach((op) => {
      if (isCustomEmpty || !custom.find(({ name }) => name === op.name)) {
        custom.push(op);
      }
    });
    data?.system?.forEach((op) => {
      if (isSystemEmpty || !system.find(({ name }) => name === op.name)) {
        system.push(op as SystemOperation);
      }
    });
    setMergedOperations({ custom, system });
  }

  function onUpdateOperation(
    type: 'system' | 'custom',
    operation: SystemOperation,
    value: Partial<SystemOperation>,
  ) {
    onChange({
      ...mergedOperations,
      [type]: mergedOperations[type].map((o: CustomOperation) => {
        if (operation == o) {
          return {
            ...o,
            ...value,
          };
        }
        return o;
      }),
    });
  }

  function listRender(label: string, operation: SystemOperation[], type: 'system' | 'custom') {
    if (!operation.length) {
      return null;
    }

    return (
      <>
        <div className="text-caption-no-color text-gray-400 pl-20 py-10 pr-20 shadow-header">
          {label}
        </div>
        {operation.map((op) => {
          return (
            <div
              key={op.name}
              className="flex items-center justify-between pr-20 py-16 shadow-header"
            >
              <Toggle
                disabled={!op.changeable}
                defaultChecked={op.enabled}
                className="ml-20"
                onChange={(checked) => onUpdateOperation(type, op, {
                  enabled: !!checked,
                })}
              />
              <div>{op.name}</div>
              <div className="relative w-188">
                {(op.text || op.name) && (
                  <>
                    <input
                      className="input w-full pr-36"
                      value={op.text || op.name}
                      onChange={(v) => onUpdateOperation(type, op, {
                        text: v.target.value,
                      })}
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
                          onClick={() => onUpdateOperation(type, op, {
                            text: op.name,
                          })}
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
            </div>
          );
        })}
      </>
    );
  }

  if (isLoading || !mergedOperations) {
    return <Loading desc="加载中..." />;
  }

  if (isError) {
    return <ErrorTips desc="出错了..." />;
  }

  return (
    <>
      <div className="text-caption-no-color text-gray-400 mt-16 mb-12">
        在此设置该节点负责人在处理工作流时可进行的操作
      </div>
      <header className="flex items-center pr-20 py-8 bg-gray-100 rounded-8">
        <div className="mr-40 pl-20">是否开启</div>
        <div className="mr-100">操作</div>
        <div>按钮文案</div>
      </header>
      {listRender('默认操作', mergedOperations.system, 'system')}
      {listRender('自定义操作', mergedOperations.custom as SystemOperation[], 'custom')}
    </>
  );
}

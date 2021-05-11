import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';

import Toggle from '@c/toggle';
import Icon from '@c/icon';
import Tooltip from '@c/tooltip';
import Loading from '@c/loading';
import ErrorTips from '@c/error-tips';

import { getOperationList } from '../../api';
import {
  DefaultOperation,
  CustomOperation,
  OperationPermission as OperationPermissionType,
} from '../../../store';

interface Props {
  value: OperationPermissionType;
  onChange: (value: OperationPermissionType) => void;
}

export default function OperatorPermission({ value, onChange }: Props) {
  const { data, isLoading, isError } = useQuery(['GET_OPERATION_LIST'], getOperationList);
  const [mergedOperations, setMergedOperations] = useState<OperationPermissionType>(value);

  useEffect(() => {
    if (data) {
      mergeOperation();
    }
  }, [data, value]);

  function mergeOperation() {
    const { custom, default: df } = value;
    const isCustomEmpty = !custom.length;
    const isDefaultEmpty = !df.length;
    data?.custom.forEach((op) => {
      if (isCustomEmpty || !custom.find(({ name }) => name === op.name)) {
        custom.push(op);
      }
    });
    data?.default.forEach((op) => {
      if (isDefaultEmpty || !df.find(({ name }) => name === op.name)) {
        df.push(op as DefaultOperation);
      }
    });
    setMergedOperations({ custom, default: df });
  }

  function onUpdateOperation(
    type: 'default' | 'custom',
    operation: DefaultOperation,
    value: Partial<DefaultOperation>,
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

  function listRender(label: string, operation: DefaultOperation[], type: 'default' | 'custom') {
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
                {(op.text || op.defaultText) && (
                  <>
                    <input
                      className="input w-full pr-36"
                      value={op.text || op.defaultText}
                      onChange={(v) => onUpdateOperation(type, op, {
                        text: v.target.value,
                      })}
                    />
                    {op.text !== op.defaultText && (
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
                            text: op.defaultText,
                          })}
                        />
                      </Tooltip>
                    )}
                    {
                      op.text === op.defaultText && (
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
      {listRender('默认操作', mergedOperations.default, 'default')}
      {listRender('自定义操作', mergedOperations.custom as DefaultOperation[], 'custom')}
    </>
  );
}

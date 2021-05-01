import React, { useState } from 'react';

import Toggle from '@c/toggle';
import Icon from '@c/icon';
import Tooltip from '@c/tooltip';

interface DefaultOperation {
  enabled: boolean;
  changeable: boolean;
  name: string;
  defaultText: string;
  text: string;
}

interface CustomOperation {
  enabled: boolean;
  changeable: boolean;
  name: string;
  defaultText?: string;
  text?: string;
}

interface OperationPermission {
  default: DefaultOperation[];
  custom: CustomOperation[];
}

export default function OperatorPermission() {
  const [operations, setOperations] = useState<OperationPermission>({
    default: [{
      enabled: true,
      changeable: false,
      name: '操作',
      defaultText: 'pass',
      text: '通过',
    }, {
      enabled: true,
      changeable: false,
      name: '驳回',
      defaultText: 'reject',
      text: '不同意',
    }],
    custom: [{
      enabled: false,
      changeable: true,
      name: '转交',
    }, {
      enabled: true,
      changeable: true,
      name: '邀请阅示',
      defaultText: 'notification',
      text: '通知',
    }, {
      enabled: false,
      changeable: true,
      name: '回退',
    }, {
      enabled: false,
      changeable: true,
      name: '打回',
    }, {
      enabled: false,
      changeable: true,
      name: '抄送',
    }, {
      enabled: false,
      changeable: true,
      name: '加签',
    }],
  });

  function onUpdateOperation(
    type: 'default' | 'custom',
    operation: DefaultOperation,
    value: Partial<DefaultOperation>,
  ) {
    setOperations((ops) => ({
      ...ops,
      [type]: operations[type].map((o: CustomOperation) => {
        if (operation == o) {
          return {
            ...o,
            ...value,
          };
        }
        return o;
      }),
    }));
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
      {listRender('默认操作', operations.default, 'default')}
      {listRender('自定义操作', operations.custom as DefaultOperation[], 'custom')}
    </>
  );
}

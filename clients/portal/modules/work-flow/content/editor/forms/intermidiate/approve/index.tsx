import React, { useState } from 'react';
import { pipe, some, every, get, map, values, pick } from 'lodash/fp';

import Tab from '@c/tab';

import type { FillInData, NodeType } from '@flowEditor/type';
import SaveButtonGroup from '@flowEditor/components/_common/action-save-button-group';
import { updateStore } from '@flowEditor/store';
import { DeadLine, WhenTimeout } from '@flowEditor/type';

import BasicConfig from '../components/basic-config';
import FieldPermission from '../components/field-permission';
import OperatorPermission from '../components/operator-permission';

interface Props {
  defaultValue: FillInData;
  onSubmit: (v: FillInData) => void;
  onCancel: () => void;
  nodeType: NodeType;
  onChange: () => void;
}

export default function ApproveForm({
  defaultValue, onSubmit, onCancel, nodeType, onChange,
}: Props): JSX.Element {
  const [value, setValue] = useState<FillInData>(defaultValue || {});

  function handleChange(val: Partial<FillInData>): void {
    onChange();
    setValue((v) => ({ ...v, ...val }));
  }

  function onSave(): void {
    const { timeRule } = value.basicConfig;
    const someValueIsInvalid = pipe(
      map(({ path, validator }) => ({ value: get(path, timeRule), validator })),
      some(({ value, validator }) => validator ? validator(value) : !value),
    );
    const someKeyIsInvalid = pipe(
      pick(['day', 'hours', 'minutes']),
      values,
      every((v) => +v <= 0),
    );
    if (timeRule.enabled && someValueIsInvalid([
      { path: 'deadLine.breakPoint' },
      { path: 'deadLine', validator: (val: DeadLine) => someKeyIsInvalid(val) },
      { path: 'whenTimeout', validator: (val: WhenTimeout) => val.type === 'autoDealWith' && !val.value },
    ])) {
      return updateStore((s) => ({ ...s, validating: true }));
    }
    onSubmit(value);
  }

  return (
    <>
      <Tab
        className="mt-10"
        items={[{
          id: 'basicConfig',
          name: '基础配置',
          content: (
            <BasicConfig
              value={value.basicConfig}
              onChange={handleChange}
              type={nodeType}
            />
          ),
        }, {
          id: 'fieldPermission',
          name: '字段权限',
          content: (
            <FieldPermission
              value={value.fieldPermission}
              onChange={handleChange}
            />
          ),
        }, {
          id: 'operatorPermission',
          name: '操作权限',
          content: (
            <OperatorPermission
              value={value.operatorPermission}
              onChange={handleChange}
              type={nodeType}
            />
          ),
        }]}
      />
      <SaveButtonGroup onSave={onSave} onCancel={onCancel} />
    </>
  );
}

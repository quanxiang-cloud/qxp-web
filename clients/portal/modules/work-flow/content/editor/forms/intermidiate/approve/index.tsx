import React, { useState } from 'react';
import { useUpdateEffect } from 'react-use';
import { pipe, some, every, get, map, values, pick } from 'lodash/fp';

import Tab from '@c/tab';

import type { FillInData, NodeType } from '@flow/content/editor/type';
import SaveButtonGroup from '@flow/content/editor/components/_common/action-save-button-group';
import { updateStore } from '@flow/content/editor/store';
import { DeadLine, WhenTimeout } from '@flow/content/editor/type';

import BasicConfig from '../components/basic-config';
import FieldPermission from '../components/field-permission';
import OperatorPermission from '../components/operator-permission';

interface Props {
  defaultValue: FillInData;
  onSubmit: (v: FillInData) => void;
  onCancel: () => void;
  nodeType: NodeType;
  onChange: (v: FillInData) => void;
}

export default function ApproveForm({
  defaultValue, onSubmit, onCancel, nodeType, onChange,
}: Props): JSX.Element {
  const [value, setValue] = useState<FillInData>(defaultValue || {});
  const [tabKey, setTabKey] = useState('basicConfig');

  useUpdateEffect(() => {
    onChange(value);
  }, [value]);

  function handleChange(val: Partial<FillInData>): void {
    setValue((v) => ({ ...v, ...val }));
  }

  function onSave(): void {
    const { timeRule, approvePersons } = value.basicConfig;
    const someValueIsInvalid = pipe(
      map(({ path, target, validator }) => ({ value: get(path, target), validator })),
      some(({ value, validator }) => validator ? validator(value) : !value),
    );
    const someKeyIsInvalid = pipe(
      pick(['day', 'hours', 'minutes']),
      values,
      every((v) => +v <= 0),
    );
    const deadLineValidate = someValueIsInvalid([
      { path: 'deadLine.breakPoint', target: timeRule },
      { path: 'deadLine', target: timeRule, validator: (val: DeadLine) => someKeyIsInvalid(val) },
      { path: 'whenTimeout', target: timeRule, validator: (val: WhenTimeout) => {
        return val.type === 'autoDealWith' && !val.value;
      } },
    ]);
    const userPickValidate = someValueIsInvalid([
      { path: 'users', target: approvePersons, validator: (val: Array<string>) => {
        return approvePersons.type === 'person' && !val?.length;
      } },
      { path: 'fields', target: approvePersons, validator: (val: Array<string>) => {
        return approvePersons.type === 'field' && !val?.length;
      } },
    ]);
    if ((timeRule.enabled && deadLineValidate) || userPickValidate) {
      setTabKey('basicConfig');
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
        currentKey={tabKey}
        onChange={(id) => setTabKey(id)}
      />
      <SaveButtonGroup onSave={onSave} onCancel={onCancel} />
    </>
  );
}

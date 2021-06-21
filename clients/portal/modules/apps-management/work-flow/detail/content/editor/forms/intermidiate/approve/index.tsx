import React, { useState } from 'react';

import Tab from '@c/tab';

import type { FillInData, NodeType } from '@flowEditor/type';
import SaveButtonGroup from '@flowEditor/components/_common/action-save-button-group';

import BasicConfig from '../components/basic-config';
import FieldPermission from '../components/field-permission';
import OperatorPermission from '../components/operator-permission';

interface Props {
  defaultValue: FillInData;
  onSubmit: (v: FillInData) => void;
  onCancel: () => void;
  nodeType: NodeType;
}

export default function ApproveForm({ defaultValue, onSubmit, onCancel, nodeType }: Props): JSX.Element {
  const [value, setValue] = useState<FillInData>(defaultValue || {});

  function onChange(val: Partial<FillInData>): void {
    setValue((v) => ({ ...v, ...val }));
  }

  function onSave(): void {
    // todo get data value
    // todo validate data value
    // todo call onSubmit when data is valid
    onSubmit(value);
  }

  function onClose(): void {
    // todo check if the data is changed
    // todo pop close confirm when data is changed and is not saved
    // todo call onCancel when data is not changed or is saved
    onCancel();
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
              onChange={onChange}
              type={nodeType}
            />
          ),
        }, {
          id: 'fieldPermission',
          name: '字段权限',
          content: (
            <FieldPermission
              value={value.fieldPermission}
              onChange={onChange}
            />
          ),
        }, {
          id: 'operatorPermission',
          name: '操作权限',
          content: (
            <OperatorPermission
              value={value.operatorPermission}
              onChange={onChange}
              type={nodeType}
            />
          ),
        }]}
      />
      <SaveButtonGroup onSave={onSave} onCancel={onClose} />
    </>
  );
}

import React from 'react';

import Tab from '@c/tab2';

import type { BusinessData, NodeType } from '@flow/detail/content/editor/type';

import BasicConfig from '../components/basic-config';
import FieldPermission from '../components/field-permission';
import OperatorPermission from '../components/operator-permission';

interface Props {
  value: BusinessData;
  onChange: (v: Partial<BusinessData>) => void;
  nodeType: NodeType;
}

export default function ApproveForm({ value, onChange, nodeType }: Props) {
  return (
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
  );
}

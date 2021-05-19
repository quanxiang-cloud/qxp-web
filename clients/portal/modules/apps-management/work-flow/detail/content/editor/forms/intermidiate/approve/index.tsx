import React from 'react';
import cs from 'classnames';

import Tab from '@c/tab';

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
      headerClassName="border-gray-200 border-b-1"
      titleClassName={cs(
        'bg-white hover:bg-white',
        'hover:border-blue-600 hover:border-b-4'
      )}
      activeTitleClassName="border-blue-600 border-b-4"
      contentClassName="overflow-scroll bg-white"
      style={{ height: 'calc(100% - 56px)' }}
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

import React from 'react';

import Tab from '@c/tab';

import DataPermission from './data-permission';
import BasicInfo from './basic-info';
import Authorized from './authorized';
import FieldPermissions from './field-permissions';

import './index.scss';

function RightSetting() {
  return (
    <div>
      <Tab
        className="mt-4 py-16"
        contentClassName="rounded-12 rounded-tl-none"
        items={[
          {
            id: 'basicInfo',
            name: '名称信息',
            content: (<BasicInfo />),
          },
          {
            id: 'authorized',
            name: '操作权限',
            content: (<Authorized />),
          },
          {
            id: 'fieldPermissions',
            name: '字段查看权限',
            content: (<FieldPermissions />),
          },
          {
            id: 'association',
            name: '数据查看权限',
            content: (<DataPermission />),
          },
        ]}
      />
    </div>
  );
}

export default RightSetting;

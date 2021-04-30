import React from 'react';

import Tab from '@c/tab';

import DataPermission from './data-permission';
import BasicInfo from './basic-info';
import Authorized from './authorized';
import FieldPermissions from './field-permissions';

import './index.scss';

type Props = {
  rights: Rights
}

function RightSetting({ rights }: Props) {
  return (
    <div className='p-20 h-full'>
      <Tab
        className="mt-4 py-16"
        contentClassName="rounded-12 rounded-tl-none"
        items={[
          {
            id: 'basicInfo',
            name: '名称信息',
            content: (<BasicInfo rights={rights} />),
          },
          {
            id: 'authorized',
            name: '操作权限',
            content: (<Authorized rightsID={rights.id} />),
          },
          {
            id: 'fieldPermissions',
            name: '字段查看权限',
            content: (<FieldPermissions rightsID={rights.id} />),
          },
          {
            id: 'association',
            name: '数据查看权限',
            content: (<DataPermission rightsID={rights.id} />),
          },
        ]}
      />
    </div>
  );
}

export default RightSetting;

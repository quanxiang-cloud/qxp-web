import React from 'react';

import Tab from '@c/tab2';

import BasicInfo from './basic-info';
import PageFormTable from './page-form-table';

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
            id: 'worksheetPer',
            name: '工作表权限设置',
            content: (<PageFormTable />),
          },
        ]}
      />
    </div>
  );
}

export default RightSetting;

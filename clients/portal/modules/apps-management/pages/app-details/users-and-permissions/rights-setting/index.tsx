import React from 'react';

import Tab from '@c/tab';

import BasicInfo from './basic-info';
import PageFormTable from './page-form-table';

import './index.scss';

type Props = {
  rights: Rights
}

function RightSetting({ rights }: Props): JSX.Element {
  return (
    <div className='p-20 h-full'>
      <Tab
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
            content: (<PageFormTable rightsGroupID={rights.id} />),
          },
        ]}
      />
    </div>
  );
}

export default RightSetting;

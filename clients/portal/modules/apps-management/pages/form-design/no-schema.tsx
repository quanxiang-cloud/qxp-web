import React from 'react';

import AbsoluteCentered from '@portal/modules/apps-management/components/absolute-centered';

export default function NoSchema() {
  return (
    <AbsoluteCentered>
      <div className='app-no-data'>
        <img src='/dist/images/drag_tips.svg' />
        <span>请先添加数据!</span>
      </div>
    </AbsoluteCentered>
  );
}

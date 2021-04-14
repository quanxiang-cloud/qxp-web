import React from 'react';
import { inject, observer } from 'mobx-react';

import TextHeader from '@c/text-header';

import PageBuildNav from './page-build-nav';
import './index.scss';

type Props = {
  appPagesStore?: any
}

function PageDetails({ appPagesStore }: Props) {
  const { curPage } = appPagesStore;

  if (!curPage.id) {
    return null;
  }

  return (
    <div className='flex flex-col flex-1'>
      <TextHeader
        title={curPage.departmentName}
        action="📌  表单、流程、报表何时使用？快速上手"
        className="bg-white px-20 py-18 header-background-image"
        itemTitleClassName="text-h5" />
      <PageBuildNav />
    </div>
  );
}

export default inject('appPagesStore')(observer(PageDetails));

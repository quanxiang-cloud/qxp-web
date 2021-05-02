import React from 'react';
import { observer } from 'mobx-react';

import PageLoading from '@appC/page-loading';

import AppPagesTree from './app-pages-tree';
import store from '../../store';
import './index.scss';

function PageNav() {
  const onSelect = (pageNode: PageInfo) => {
    if (pageNode.menuType === 1) {
      return;
    }

    store.setCurPage(pageNode);
  };

  if (store.pageListLoading) {
    return <div className='app-details-nav'><PageLoading /></div>;
  }

  return (
    <div className='app-details-nav'>
      <div className='app-page-tree-wrapper'>
        <AppPagesTree
          onSelectPage={onSelect}
          selectedPage={store.curPage}
          tree={store.pagesTreeData}
        />
      </div>
    </div>
  );
}

export default observer(PageNav);

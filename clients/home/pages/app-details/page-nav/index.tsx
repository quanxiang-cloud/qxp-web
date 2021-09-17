import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { observer } from 'mobx-react';

import PageLoading from '@c/page-loading';
import { getQuery } from '@lib/utils';

import AppPagesTree from './app-pages-tree';
import store from '../store';
import './index.scss';

function PageNav() {
  const history = useHistory();
  const { pageID } = getQuery<{ pageID: string }>();
  const { appID } = useParams<{ appID: string }>();

  useEffect(() => {
    store.setPageID(pageID);
  }, [pageID]);

  const onSelect = (pageNode: PageInfo) => {
    history.replace(`/apps/${appID}?/page_setting?pageID=${pageNode.id}`);
  };

  if (store.pageListLoading) {
    return <div className='app-details-nav'><PageLoading /></div>;
  }

  return (
    <div className='app-details-nav'>
      <div className='app-page-tree-wrapper pt-20'>
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

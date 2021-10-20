import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { observer } from 'mobx-react';

import AbsoluteCentered from '@c/absolute-centered';
import PageLoading from '@c/page-loading';
import TwoLevelMenu from '@c/two-level-menu';
import { getQuery } from '@lib/utils';

import store from '../store';
import './index.scss';

function PageNav(): JSX.Element {
  const history = useHistory();
  const { pageID } = getQuery<{ pageID: string }>();
  const { appID } = useParams<{ appID: string }>();

  useEffect(() => {
    store.setPageID(pageID);
  }, [pageID]);

  const onSelect = (pageNode: PageInfo): void => {
    history.replace(`/apps/${appID}?/page_setting?pageID=${pageNode.id}`);
  };

  if (store.pageListLoading) {
    return <div className='app-details-nav'><PageLoading /></div>;
  }

  return (
    <div className='app-details-nav bg-gray-50 py-10'>
      {store.pageList.length ? (
        <TwoLevelMenu<PageInfo>
          menus={store.pageList}
          defaultSelected={store.curPage.id}
          onSelect={(page) => onSelect(page.source as PageInfo)}
        />
      ) : (
        <AbsoluteCentered>
          <div className='app-no-data'>
            <img src='/dist/images/empty-tips.svg' />
            <span>暂无页面，请联系管理员</span>
          </div>
        </AbsoluteCentered>
      )}
    </div>
  );
}

export default observer(PageNav);

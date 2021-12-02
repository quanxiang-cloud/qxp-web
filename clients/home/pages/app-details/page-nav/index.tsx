import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { observer } from 'mobx-react';
import cs from 'classnames';

import Icon from '@c/icon';
import { getQuery } from '@lib/utils';
import PageLoading from '@c/page-loading';
import AppsSwitcher from '@c/apps-switcher';
import TwoLevelMenu from '@c/two-level-menu';
import AbsoluteCentered from '@c/absolute-centered';

import store from '../store';
import RoleSwitcher from '../role-switcher';

import './index.scss';

function PageNav(): JSX.Element {
  const history = useHistory();
  const { pageID } = getQuery<{ pageID: string }>();
  const { appID } = useParams<{ appID: string }>();
  const homeAppNavStatus = localStorage?.getItem('HOME_APP_PAGE_NAV_STATUS_v1')?.split(':') || [];
  const currentPageNavStatus = homeAppNavStatus[0] === appID ? homeAppNavStatus[1] : 'open';

  useEffect(() => {
    if (!currentPageNavStatus) {
      store.showPageNav = true;
      store.isMouseControl = false;
    } else {
      store.showPageNav = currentPageNavStatus === 'open';
      store.isMouseControl = currentPageNavStatus === 'close';
    }
  }, []);

  useEffect(() => {
    store.setPageID(pageID);
  }, [pageID]);

  const onSelect = (pageNode: PageInfo): void => {
    history.replace(`/apps/${appID}?pageID=${pageNode.id}`);
  };

  const handleChange = (newAppId: string): void => {
    history.replace(location.pathname.replace(appID, newAppId));
  };

  if (store.pageListLoading) {
    return <div className='app-details-nav'><PageLoading /></div>;
  }

  return (
    <div className='app-page-nav relative'>
      <div className={cs('nav-content ease-in-out duration-300 shadow-more-action', {
        collapse: !store.showPageNav,
      })}>
        <div className='nav-content-header w-208 h-52 overflow-hidden flex items-center justify-center sticky top-0 z-20 bg-gray-50'>
          <div
            onClick={() => history.push('/')}
            className='app-header-icon text-gray-400 corner-8-8-8-2'
          >
            <Icon size={21} className='m-6 fill-current' name='home_qxp'/>
          </div>
          <span className='mx-8 text-14'>/</span>
          <AppsSwitcher
            hiddenStatus={true}
            apps={store.appList}
            currentAppID={appID}
            onChange={handleChange}
          />
        </div>
        <div className='app-page-tree-wrapper flex flex-col-reverse'>
          {store.roleOptions.length > 1 && <RoleSwitcher />}

          {store.pageList.length ? (
            <TwoLevelMenu<PageInfo>
              menus={store.pageList}
              defaultSelected={store.curPage.id}
              onSelect={(page) => onSelect(page.source as PageInfo)}
              className='app-page-tree overflow-x-hidden'
              groupBanSelect
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
      </div>
      <div className='control-hidden-button text-blue-600'>
        {store.showPageNav && !store.isMouseControl && (
          <Icon
            name='arrow-left'
            color='gray'
            className='hover:text-current'
            size={48}
            onClick={() => {
              localStorage?.setItem('HOME_APP_PAGE_NAV_STATUS_v1', `${appID}:close`);
              store.closePageNav();
              store.openMouseControl();
            }}
          />
        )}
        {store.isMouseControl && (
          <Icon
            name='arrow-right'
            color='gray'
            className='hover:text-current'
            size={48}
            onClick={() => {
              localStorage?.setItem('HOME_APP_PAGE_NAV_STATUS_v1', `${appID}:open`);
              store.openPageNav();
              store.closeMouseControl();
            }}
          />
        )}
      </div>
    </div>
  );
}

export default observer(PageNav);

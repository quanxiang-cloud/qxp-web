import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { observer } from 'mobx-react';

import toast from '@lib/toast';
import GlobalHeader from '@home/components/global-header';

import PageNav from './page-nav';
import PageDetails from './page-details';
import store from './store';
import { fetchUserList } from '@home/lib/api';

function AppDetails(): JSX.Element {
  const history = useHistory();
  const { appID } = useParams<{ appID: string }>();

  useEffect(() => {
    fetchUserList().then((res: any) => {
      if (res.data.findIndex(({ id }: AppInfo) => id === appID) === -1) {
        toast.error('应用不存在！2秒后跳转到首页');
        setTimeout(() => {
          history.replace('/');
        }, 2000);
        return;
      }
      store.setAppList(res.data);

      return store.fetchPageList(appID);
    }).catch(() => {
      toast.error('获取app页面列表失败！2秒后跳转到首页');
      setTimeout(() => {
        history.replace('/');
      }, 2000);
    });

    return () => {
      store.clear();
    };
  }, [appID]);

  useEffect(() => {
    if (store.pageListLoading) {
      return;
    }

    store.getRoleInfo(appID);
  }, [appID, store.pageListLoading]);

  function handleShowPageNav(e: React.MouseEvent): void {
    if (store.isMouseControl) {
      if (e.clientX <= 0) {
        store.openPageNav();
      } else if (e.clientX > 224) {
        store.closePageNav();
      }
    }
  }

  return (
    <>
      <GlobalHeader />
      <div className='main-content-without-header flex' onMouseMove={handleShowPageNav}>
        <PageNav />
        <PageDetails />
      </div>
    </>
  );
}

export default observer(AppDetails);

import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { HomePageProps } from '../types';
import Header from '../header/header';
import store from '@home/pages/store';
import HomeCard from '../home-card';
import Empty from '@m/qxp-ui-mobile/empty';
import AppItem, { NewAppInfo } from '@m/components/app-item';
import appsStore from '@m/pages/apps/app-detail/store';

import { parseAppIcon } from './utils';

const Workbench: React.FC<HomePageProps> = (props) => {
  const history = useHistory();

  useEffect(() => {
    if (props.active) {
      store.fetchAppList();
    }
  }, [props.active]);

  function onClick(appInfo: NewAppInfo): void {
    appsStore.init({ name: appInfo.appName, color: appInfo.appIcon.bgColor, id: appInfo.id });
    // history.push(`${pathPrefix}/apps/${appInfo.id}`);
    if (appInfo.accessURL) {
      window.location.href = appInfo.accessURL;
    }
  }

  return (
    <Header active={props.active} key={props.key}>
      {!!store.appList.length && (
        <div className='home-page-wrapper'>
          <HomeCard title='我的应用' className='overflow-scroll'>
            <div className='my-apps-wrapper'>
              {
                store.appList.map((appInfo: AppInfo) => {
                  const appIcon = parseAppIcon(appInfo.appIcon);
                  const newInfo = { ...appInfo, appIcon } as NewAppInfo;
                  return (
                    <AppItem
                      key={appInfo.id}
                      icon={appIcon.iconName}
                      bgColor={appIcon.bgColor}
                      appName={appInfo.appName}
                      onClick={() => onClick(newInfo)}
                    />
                  );
                })
              }
            </div>
          </HomeCard>
        </div>
      )}
      {!store.appList.length && (
        <Empty title='暂无应用' content='请联系企业内管理员添加/上线应用'>
          <Empty.Image src='/dist/images/no-approval-task.svg' />
        </Empty>
      )}
    </Header>
  );
};

export default Workbench;

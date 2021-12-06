import React, { useEffect } from 'react';
import { HomePageProps } from '../types';
import Header from '../header/header';
import store from '@home/pages/store';
import HomeCard from '@m/pages/dashboard/home-card';
import { useHistory } from 'react-router-dom';
import Empty from '@m/qxp-ui-mobile/empty';
import AppItem from '@m/components/app-item';

const Workbench: React.FC<HomePageProps> = (props) => {
  const history = useHistory();

  useEffect(() => {
    if (props.active) {
      store.fetchAppList();
    }
  }, [props.active]);

  return (
    <Header active={props.active} key={props.key}>
      {!!store.appList.length && (
        <div className='home-page-wrapper'>
          <HomeCard title='我的应用' className='overflow-scroll'>
            <div className='my-apps-wrapper'>
              {store.appList.map((appInfo: AppInfo) => (
                <AppItem
                  key={appInfo.id}
                  appInfo={appInfo}
                  onClick={() => history.push('/apps/' + appInfo.id)}
                />
              ))}
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

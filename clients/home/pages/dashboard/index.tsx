import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';

import Avatar from '@c/avatar';
import Card from '@c/card';
import Icon from '@c/icon';
import AppInfoView from '@portal/modules/apps-management/components/app-info-view';

import store from '../store';

import './index.scss';

function Dashboard() {
  const history = useHistory();

  useEffect(() => {
    document.title = '工作台';
    store.fetchAppList();
  }, []);

  return (
    <>
      <main className="py-40 px-58 relative"
        style={{ height: 'calc(100vh - 62px)', overflow: 'scroll' }}>
        <div className="flex justify-between items-center">
          <Card
            className="flex-2 user-card user-info-bg"
            itemTitleClassName="text-h5"
            content={
              (<>
                <div className="z-10">
                  <Avatar
                    username={window.USER.userName}
                    bio="不是杰出者才能做梦，而是善梦者才杰出"
                    avatar=''
                  />
                  <div className="pl-48 mt-20">
                    <div>
                      <img className="inline-block mr-8" src="/dist/images/user-email.svg" />
                      邮箱：{window.USER.email}
                    </div>
                    <div className="mt-8">
                      <img className="inline-block mr-8" src="/dist/images/dep.svg" />
                      部门：{window.USER.depIds}
                    </div>
                  </div>
                </div>
              </>)
            }
          />
          <Card
          // flex-2 self-stretch px-40 py-20 text-16 mr-20
            className="flex-3 user-card relative"
            title="待办事项"
            headerClassName="pb-32"
            itemTitleClassName="text-h5"
            content={
              (<>
                <div className="backlog text-red-600">
                  {12}
                  <p>已超时</p>
                </div>
                <div className="backlog text-yellow-600">
                  {4}
                  <p>催办</p>
                </div>
                <div className="backlog text-gray-900">
                  {16}
                  <p>全部待办</p>
                </div>
                <img className="absolute bottom-0 right-0" src="/dist/images/frame.svg" alt=""/>
              </>)
            }
          />
          {/* <div className="w-20 "></div> */}
          <Card
          // flex-2 self-stretch px-40 py-20 text-16 mr-20
            className="flex-2 user-card user-card-last"
            itemTitleClassName="text-h5"
            contentClassName="flex-col"
            content={
              (<>
                <div className="message-handel-list relative">
                  <Icon className="mr-8" name="addchart" size={20} />
                  我发起的
                  <div className="rbtns">
                    {false && (<div className="untreated">15</div>)}
                    <Icon name="chevron_right" size={20} />
                  </div>
                </div>
                <div className="message-handel-list border-y relative">
                  <Icon className="mr-8" name="done_all" size={20} />
                  我已处理
                  <div className="rbtns">
                    {false && (<div className="untreated">15</div>)}
                    <Icon name="chevron_right" size={20} />
                  </div>
                </div>
                <div className="message-handel-list relative">
                  <Icon className="mr-8" name="send_me" size={20} />
                  抄送给我
                  <div className="rbtns">
                    {true && (<div className="untreated">15</div>)}
                    <Icon name="chevron_right" size={20} />
                  </div>
                </div>
              </>)
            }
          />
        </div>
        <div className="px-6 mt-40">
          <Card
            className="px-32 py-20 user-app-list-container"
            headerClassName="ml-8"
            title="我的应用"
            itemTitleClassName="text-h5"
            content={
              (
                <div className='flex flex-wrap gap-20 justify-between'>
                  {store.appList.map((appInfo: AppInfo) => (
                    <AppInfoView
                      onClick={() => history.push('/apps/' + appInfo.id)}
                      className='rounded-12 bg-white user-app-item'
                      key={appInfo.id}
                      appInfo={appInfo}
                    />
                  ))}
                </div>
              )
            }
          />
        </div>
      </main>
    </>
  );
}

export default observer(Dashboard);

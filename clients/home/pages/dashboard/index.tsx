import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import cs from 'classnames';

import Avatar from '@c/avatar';
import Card from '@c/card';
import Icon from '@c/icon';
import AppInfoView from '@portal/modules/apps-management/components/app-info-view';

import store from '../store';

import './index.scss';

type Status = {
  value: number;
  key: 'OVERTIME' | 'URGE' | '';
  name: string;
  color: string;
}

type handel = {
  key: number;
  name: string;
  icon: string;
  count: null | number
}

const UNTREATED_LIST: Array<Status> = [
  { value: 12, key: 'OVERTIME', name: '已超时', color: 'text-red-600' },
  { value: 4, key: 'URGE', name: '催办', color: 'text-yellow-600' },
  { value: 16, key: '', name: '全部待办', color: 'text-gray-900' },
];

const HANDLE_LIST: Array<handel> = [
  { key: 0, name: '我发起的', icon: 'addchart', count: 0 },
  { key: 1, name: '我已处理', icon: 'done_all', count: null },
  { key: 2, name: '抄送给我', icon: 'send_me', count: 15 },
];

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
        <div className="flex justify-between items-center px-6">
          <Card
            className="flex-2 user-card user-info-bg"
            itemTitleClassName="text-h5"
            content={(<>
              <div className="z-10">
                <Avatar
                  username={window.USER.userName}
                  title={true}
                  size={48}
                  textSize={24}
                  cornerClassName="corner-12-2-12-12"
                  bio="不是杰出者才能做梦，而是善梦者才杰出"
                  avatar=''
                />
                <div className="pl-48 mt-20 text-16">
                  <div>
                    <img className="inline-block mr-8" src="/dist/images/email.svg" />
                      邮箱：{window.USER.email}
                  </div>
                  <div className="mt-8">
                    <img className="inline-block mr-8" src="/dist/images/department.svg" />
                      部门：{window.USER.dep.departmentName}
                  </div>
                </div>
              </div>
            </>)}
          />
          <Card
            className="flex-3 user-card relative"
            title="待办事项"
            headerClassName="pb-32"
            itemTitleClassName="text-h5"
            content={(<>
              {UNTREATED_LIST.map(({ value, name, key, color }) => (
                <div className={`backlog ${color}`} key={key} onClick={() => {
                  history.push('/approvals');
                }}>
                  {value}
                  <p>{name}</p>
                </div>
              ))}
              <img className="absolute bottom-0 right-0" src="/dist/images/todo-card-bgc.svg" alt=""/>
            </>)}
          />
          <Card
            className="flex-2 user-card user-card-last"
            itemTitleClassName="text-h5"
            contentClassName="flex-col"
            content={(<>
              {HANDLE_LIST.map(({ name, key, icon, count }) => {
                const number = count === 0 ? null : count;
                return (
                  <div className={cs('message-handel-list', { 'border-y': key === 1 })} key={key}>
                    <Icon className="mr-8" name={icon} size={20} />
                    {name}
                    <div className="rbtns">
                      {number && (<div className="untreated">{number}</div>)}
                      <Icon name="chevron_right" size={20} />
                    </div>
                  </div>
                );
              })}
            </>)}
          />
        </div>
        <div className="px-6 mt-40">
          <Card
            className="px-32 py-20"
            headerClassName="ml-8"
            title={<span>我的应用  <span className="ml-4 text-gray-400">({store.appList.length})</span></span>}
            itemTitleClassName="text-h6"
            contentClassName="grid grid-cols-4 gap-16"
            content={(<>
              {store.appList.map((appInfo: AppInfo) => (
                <AppInfoView
                  onClick={() => history.push('/apps/' + appInfo.id)}
                  className='rounded-12 bg-white user-app-item'
                  key={appInfo.id}
                  appInfo={appInfo}
                />
              ))}
            </>)}
          />
        </div>
      </main>
    </>
  );
}

export default observer(Dashboard);

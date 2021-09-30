import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import cs from 'classnames';

import Avatar from '@c/avatar';
import ItemWithTitleDesc from '@c/item-with-title-desc';
import Card from '@c/card';
import Icon from '@c/icon';
import AppInfoView from '@c/app-info-view';

import store from '../store';

import './index.scss';

function Dashboard() {
  const history = useHistory();

  useEffect(() => {
    document.title = '工作台';
    store.fetchTodoList();
    store.fetchAppList();
  }, []);

  return (
    <>
      <main className="px-20 relative"
        style={{ height: 'calc(100vh - 52px)', overflow: 'auto' }}>
        <div className="flex justify-between items-center">
          <Card
            className="flex-2 user-card user-info-bg mt-20"
            itemTitleClassName="text-h5"
            content={(<>
              <div className="z-10">
                <ItemWithTitleDesc
                  itemRender={(<Avatar
                    username={window.USER.userName}
                    size={48}
                  />)}
                  title={`${window.USER.userName}, 下午好!`}
                  desc="不是杰出者才能做梦，而是善梦者才杰出"
                  descClassName="text-12"
                  titleClassName="text-h4"
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
            className="flex-3 user-card todo-list-bg relative mt-20"
            title="待办事项"
            action={
              <a className="transition ease-linear text-black-50 text-underline-no-color">查看全部</a>
            }
            headerClassName="pb-32"
            itemTitleClassName="text-h6"
            content={(<>
              {store.TODO_LIST.map(({ value, name, key, color }) => (
                <div
                  className={`backlog ${color}`}
                  key={key}
                  onClick={() => {
                    history.push('/approvals');
                    if (name === '已超时') {
                      history.push('/approvals?tagType=OVERTIME');
                    } else if (name === '催办') {
                      history.push('/approvals?tagType=URGE');
                    }
                  }}
                >
                  {value}
                  <p>{name}</p>
                </div>
              ))}
            </>)}
          />
          <Card
            className="flex-2 user-card mt-20"
            title="我的申请"
            action={
              <a className="transition ease-linear text-black-50 text-underline-no-color">查看全部</a>
            }
            headerClassName="pb-8"
            itemTitleClassName="text-h6"
            contentClassName="flex-col"
            content={(<>
              {store.HANDLE_LIST.map(({ name, key, icon, count, link }) => {
                return (
                  <div
                    className={cs('message-handel-list', { 'border-y': key === 1 })}
                    key={key}
                    onClick={() => history.push(`/approvals?list=${link}`)}
                  >
                    <Icon className="mr-8" name={icon} size={20} />
                    {name}
                    <div className="rbtns">
                      {(count !== undefined && count > 0 ) && (<div className="untreated">{count}</div>)}
                      <Icon name="chevron_right" size={20} />
                    </div>
                  </div>
                );
              })}
            </>)}
          />
        </div>
        <div>
          <Card
            className="p-20 mt-16"
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

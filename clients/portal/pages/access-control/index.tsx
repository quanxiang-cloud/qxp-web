import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { usePortalGlobalValue } from '@clients/common/state/portal';

import { ListMenu } from '@portal/pages/access-control/list-menu';
import { ItemWithTitleDesc } from '@portal/components/item-with-title-desc4';
import { Error } from '@c/error2';

import RoleManagement from './role-management';
import MailList from './company-maillist';

export default function Index() {
  const { path } = useRouteMatch();
  const [{ userInfo }] = usePortalGlobalValue();

  if (!userInfo.authority.includes('accessControl')) {
    return <Error desc="您没有权限, 请联系管理员..." />;
  }

  return (
    <div className="py-20 px-58 flex justify-center items-start">
      <div className="w-316 bg-white rounded-12">
        <div className="access-background-image p-20 opacity-90">
          <ItemWithTitleDesc
            title="访问控制"
            desc="对企业通讯录、角色权限进行统一管理"
            itemRender={
              <div
                className="bg-gradient-green-to-top-right
                icon-border-radius w-48 h-48 flex-initial
                flex items-center justify-center
                "
              >
                <img src="/dist/images/person.svg" alt="calendar" />
              </div>
            }
            titleClassName="text-h4"
            descClassName="text-caption"
          />
        </div>
        <div className="p-20">
          <ListMenu />
        </div>
      </div>
      <div className='w-20'></div>
      <div className="right-content-container">
        <Switch>
          <Route exact path={`${path}`} component={MailList} />
          <Route path={`${path}/corporate-directory`} component={MailList} />
          <Route path={`${path}/role-management`} component={RoleManagement} />
        </Switch>
      </div>
    </div>
  );
}

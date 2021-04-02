import React from 'react';
import { Switch, Route } from 'react-router-dom';


import ItemWithTitleDesc from '@c/item-with-title-desc';
import Error from '@c/error';
import { usePortalGlobalValue } from '@states/portal';
import ListMenu from '@p/access-control/list-menu';

import RoleManagement from './role-management';
import DepartmentsEmployees from './departments-employees';

export default function Index() {
  const [{ userInfo }] = usePortalGlobalValue();

  if (!userInfo.authority.includes('accessControl')) {
    return <Error desc="您没有权限, 请联系管理员..." />;
  }

  return (
    <div className="py-20 px-58 flex justify-center items-start flex-grow overflow-hidden">
      <div className="w-316 bg-white rounded-12 mr-20">
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
      <div className="h-full flex-grow bg-white rounded-12 overflow-hidden">
        <Switch>
          <Route exact path="/access-control" component={DepartmentsEmployees} />
          <Route path="/access-control/role-management" component={RoleManagement} />
          <Route component={() => (<Error desc={'Menu page is not found'} />)} />
        </Switch>
      </div>
    </div>
  );
}

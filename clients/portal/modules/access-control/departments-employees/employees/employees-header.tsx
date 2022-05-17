import React from 'react';
import { observer } from 'mobx-react';
import Icon from '@one-for-all/icon';

import Authorized from '@c/authorized';
import Button from '@c/button';
import ToolTip from '@c/tooltip';
import Toggle from '@c/toggle';

import store from './store';
import { initUserInfo } from '../constant';

function EmployeesHeader(): JSX.Element {
  function handleAddUser(): void {
    store.setModalType('edit_employees');
    store.setCurrentUser(initUserInfo);
  }

  return (
    <div className="flex items-stretch px-20 justify-between">
      <Authorized authority={['accessControl/mailList/manage']}>
        <div className="flex">
          <Button
            modifier="primary"
            onClick={() => store.setModalType('import_export_employees')}
            className="mr-16"
          >
            批量导入/导出
          </Button>
          <Button
            iconName="add"
            onClick={handleAddUser}
            className="mr-16"
          >
            添加员工
          </Button>
          <ToolTip
            position="top-start"
            label='勾选成员后，才可以转移部门'
            labelClassName="adjust-department-tip"
          >
            <span>
              <Button
                modifier="primary"
                onClick={() => store.setModalType('adjust_dep')}
                className="mr-16"
                forbidden={!store.selectedUserIds.length}
              >
                变更部门
              </Button>
            </span>
          </ToolTip>
        </div>
        <div className="flex">
          <div className="flex items-center">
            <Toggle
              className="employee-toggle"
              onChange={(value) => store.setIsIncludeSubEmployees(value)}
              checked={store.isIncludeSubEmployees}
            />
            <label className="ml-5 text-12">包含子部门成员</label>
          </div>
          <div className="employee-table-setting">
            <Icon name="settings" color='var(--gray-500)' />
          </div>
        </div>
      </Authorized>
    </div>
  );
}

export default observer(EmployeesHeader);

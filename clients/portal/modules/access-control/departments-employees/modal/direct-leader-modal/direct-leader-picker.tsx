import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { observer } from 'mobx-react';

import TextHeader from '@c/text-header';
import SearchInput from '@c/form/input/search-input';
import Loading from '@c/loading';

import {
  getDepartmentStructure,
} from '@portal/modules/access-control/role-management/api';
import ErrorTips from '@c/error-tips';

import EmployeeTable from './employee-table';
import EmployeeSelectTree from '@c/employee-or-department-picker/employee-select-tree';
import OwnerStore from '@c/employee-or-department-picker/store';

interface Props {
  currentLeader?: Leader;
  employee?: Employee;
  onChange: (leader: Leader) => void;
  labelKey?: string;
  defaultValue?: string;
}

export default observer(function DirectLeaderPicker<T extends { id: string; }>({
  currentLeader,
  employee,
  onChange,
}: Props) {
  const [store, setStore] = useState<OwnerStore>();
  const { data: department, isLoading, isError } = useQuery(
    ['GET_DEPARTMENT_STRUCTURE'],
    getDepartmentStructure,
    {
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    if (department) {
      setStore(new OwnerStore(department, []));
    }
  }, [department, employee]);

  if (!store || isLoading) {
    return <Loading desc="加载中..." />;
  }
  if (isError) {
    return <ErrorTips desc="something wrong" />;
  }

  return (
    <div className="flex flex-row w-full h-full">
      <div className="w-full">
        <SearchInput
          className="mb-16"
          name="username"
          placeholder="搜索员工姓名..."
          onChange={(value) => store.setUsernameKeyword(value)}
          appendix="close"
        />
        <div className="flex flex-row mr-4" style={{ height: 'calc(100% - 65px)' }}>
          <div className="w-221 h-full flex flex-col overflow-hidden mr-20 border-r border-gray-200">
            <TextHeader
              className="mb-8 pb-0"
              title="选择部门"
              itemTitleClassName="text-h6-no-color-weight font-semibold"
              descClassName="text-caption"
            />
            <EmployeeSelectTree
              store={store.employeeTreeStore}
              className="employee-select-tree"
              wrapperClassName="flex-1 bg-white rounded-12 border-gray-200"
            />
          </div>
          <div className="h-full flex flex-col overflow-hidden flex-5">
            <TextHeader
              className="mb-8 pb-0"
              title={store.employeeTreeStore.currentFocusedNode.name || ''}
              itemTitleClassName="text-h6-no-color-weight font-semibold"
            />
            <EmployeeTable
              userName={store.usernameKeyword}
              depID={store.employeeTreeStore.currentFocusedNode.id || ''}
              ownerStore={store}
              userLeader = {currentLeader as Leader}
              onChange= {onChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

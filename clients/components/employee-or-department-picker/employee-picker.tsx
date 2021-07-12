import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { observer } from 'mobx-react';
import cs from 'classnames';

import TextHeader from '@c/text-header';
import SearchInput from '@c/form/input/search-input';
import Loading from '@c/loading';
import {
  getDepartmentStructure,
} from '@portal/modules/access-control/role-management/api';
import ErrorTips from '@c/error-tips';

import EmployeeTable from './employee-table';
import SelectedList from './selected-list';
import EmployeeSelectTree from './employee-select-tree';
import OwnerStore from './store';

interface Props {
    onChange: (departmentsOrEmployees: EmployeeOrDepartmentOfRole[]) => void;
    employees?: EmployeeOrDepartmentOfRole[];
    className?: string;
}

function EmployeePicker({
  employees = [], onChange, className,
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
    store?.owners && onChange(store.owners);
  }, [store?.owners.length]);

  useEffect(() => {
    if (department) {
      setStore(new OwnerStore(department, [...employees]));
    }
  }, [department, employees]);

  if (!store || isLoading) {
    return <Loading desc="加载中..." />;
  }
  if (isError) {
    return <ErrorTips desc="访问异常..." />;
  }

  return (
    <div className={cs('flex flex-row w-full h-full', className)}>
      <div className="mr-8">
        <SearchInput
          className="mb-16"
          name="username"
          placeholder="搜索员工姓名..."
          onChange={(value) => store.setUsernameKeyword(value)}
          appendix="close"
        />
        <div className="flex flex-row mr-4" style={{ height: 'calc(100% - 65px)' }}>
          <div className="w-221 h-full flex flex-col overflow-hidden mr-20">
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
            />
          </div>
        </div>
      </div>
      <div className="vertical-line flex-grow-0"></div>
      <SelectedList
        ownerStore={store}
      />
    </div>
  );
}

export default observer(EmployeePicker);

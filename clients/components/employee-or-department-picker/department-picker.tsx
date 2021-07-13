import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { observer } from 'mobx-react';
import cs from 'classnames';

import TextHeader from '@c/text-header';
import Loading from '@c/loading';

import {
  getDepartmentStructure,
} from '@portal/modules/access-control/role-management/api';
import ErrorTips from '@c/error-tips';

import SelectedList from './selected-list';
import DepartmentSelectTree from './department-select-tree';
import OwnerStore from './store';

interface Props {
    onChange: (departmentsOrEmployees: EmployeeOrDepartmentOfRole[]) => void;
    departments?: EmployeeOrDepartmentOfRole[];
    className?: string;
}

function EmployeeOrDepartmentPicker({
  departments = [], onChange, className,
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

  const onDepartmentTreeChange = (prevNodes: Department[], currentNodes: Department[]) => {
    if (!store) {
      return;
    }
    const add: EmployeeOrDepartmentOfRole[] = [];
    const remove: string[] = [];
    currentNodes.filter((node) => !prevNodes.find((n) => n.id === node.id)).forEach((node) => {
      const parent = store.departmentTreeStore.getNodeParents(node.id)[0];
      add.push({
        type: 2,
        ownerID: node.id,
        ownerName: node.departmentName,
        phone: '',
        email: '',
        departmentName: parent?.name,
        departmentID: parent?.id,
        createdAt: -1,
        id: node.id,
      });
    });
    prevNodes.filter((node) => !currentNodes.find((n) => n.id === node.id)).forEach((node) => {
      remove.push(node.id);
    });
    add.length && store.addOwners(add);
    remove.length && store.removeOwners(remove);
  };

  useEffect(() => {
    if (department) {
      setStore(new OwnerStore(department, [...departments]));
    }
  }, [department, departments]);

  if (!store || isLoading) {
    return <Loading desc="加载中..." />;
  }
  if (isError) {
    return <ErrorTips desc="访问异常..." />;
  }

  return (
    <div className={cs('flex flex-row w-full h-full pl-20', className)}>
      <div
        className="h-full flex flex-col overflow-hidden"
        style={{ height: 'calc(100% - 48px)' }}
      >
        <TextHeader
          className="pb-0"
          title="选择部门"
          itemTitleClassName="text-h6-no-color-weight font-semibold"
          itemClassName="flex flex-col items-start"
          textClassName="ml-0 mt-4"
          descClassName="mb-8 text-caption"
        />
        <DepartmentSelectTree
          store={store.departmentTreeStore}
          wrapperClassName="flex-1 bg-white rounded-12"
          onChange={onDepartmentTreeChange}
        />
      </div>
      <SelectedList
        ownerStore={store}
      />
    </div>
  );
}

export default observer(EmployeeOrDepartmentPicker);

import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { observer } from 'mobx-react';

import { Tab } from '@c/tab2';
import TextHeader from '@c/text-header';
import { SearchInput } from '@c/form/search-input';
import { EmployeeTable } from './employee-table';
import { SelectedList } from './selected-list';
import EmployeeSelectTree from './employee-select-tree';
import { DepartmentSelectTree } from './department-select-tree';
import { getDepartmentStructure, IOwner } from '@portal/pages/access-control/role-management/api';

import EmployeeTreeStore from './employee-select-tree/store';
import EmployeeStore from './employee-table/store';
import DepartmentTreeStore from './department-select-tree/store';
import OwnerStore from './store';
import { Loading } from '@c/loading2';

export interface IOwnerSelector {
  defaultEmployees?: IOwner[];
  refs: React.MutableRefObject<(() => IOwner[]) | undefined>;
}

export const OwnerSelector = observer(({ defaultEmployees = [], refs }: IOwnerSelector) => {
  const [store, setStore] = useState<OwnerStore>();

  const { data: department, isLoading, isError } = useQuery(
    ['getDepartmentStructure'],
    getDepartmentStructure,
    {
      refetchOnWindowFocus: false,
    },
  );

  const onDepartmentTreeChange = (prevNodes: IDepartment[], currentNodes: IDepartment[]) => {
    setStore((store) => {
      if (!store) {
        return store;
      }
      const add: IOwner[] = [];
      const remove: string[] = [];
      currentNodes.filter((node) => !prevNodes.find((n) => n.id === node.id)).forEach((node) => {
        add.push({
          type: 2,
          ownerID: node.id,
          ownerName: node.departmentName,
          phone: '',
          email: '',
          departmentName: store.departmentTreeStore.getNodeParents(node.id)[0]?.name,
          createdAt: -1,
          id: node.id,
        });
      });
      prevNodes.filter((node) => !currentNodes.find((n) => n.id === node.id)).forEach((node) => {
        remove.push(node.id);
      });
      add.length && store.addOwners(add);
      remove.length && store.removeOwners(remove);
      return store;
    });
  };

  useEffect(() => {
    if (department) {
      setStore(new OwnerStore(
        new EmployeeTreeStore(department),
        new EmployeeStore(),
        new DepartmentTreeStore(department, onDepartmentTreeChange),
        defaultEmployees,
      ));
    }
  }, [department, defaultEmployees]);

  refs.current = () => {
    return store?.owners || [];
  };

  if (!store || isLoading || isError) {
    return <Loading desc="加载中..." />;
  }

  return (
    <div className="flex flex-row w-full">
      <Tab
        className="mr-20 flex-2"
        contentClassName="rounded-12 rounded-tl-none"
        currentKey={store.tabKey}
        onChange={(key) => store.setTabKey(key as string)}
        items={[
          {
            id: '1',
            name: '按员工',
            content: (
              <>
                <SearchInput
                  className="mb-16"
                  name="username"
                  placeholder="搜索员工姓名..."
                  onChange={(value) => store.setUsernameKeyword(value)}
                  appendix="close"
                />
                <div className="flex flex-row mr-4" style={{ height: 'calc(100% - 48px)' }}>
                  <div className="h-full flex flex-col overflow-hidden flex-2 mr-20">
                    <TextHeader
                      className="mb-8 pb-0"
                      title="选择部门"
                      itemTitleClassName="text-h6-no-color-weight font-semibold"
                      descClassName="text-caption"
                    />
                    <EmployeeSelectTree
                      store={store.employeeTreeStore}
                      className="employee-select-tree"
                      wrapperClassName="flex-1 bg-white rounded-tl-12 rounded-bl-12
                      border-r border-gray-200"
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
                      className="overflow-scroll"
                      ownerStore={store}
                    />
                  </div>
                </div>
              </>
            ),
          },
          {
            id: '2',
            name: '按部门',
            content: (
              <>
                <SearchInput
                  className="mb-8"
                  name="departmentName"
                  placeholder="搜索部门名称姓名..."
                  onChange={store.setDepartmentKeyword}
                  appendix="close"
                />
                <div
                  className="h-full flex flex-col overflow-hidden"
                  style={{ height: 'calc(100% - 48px)' }}
                >
                  <TextHeader
                    className="pb-0"
                    title="选择部门"
                    itemTitleClassName="text-h6-no-color-weight font-semibold"
                    desc="角色关联部门后，在该部门下添加员工时会默认自动带入该部门的角色。例如：部门关联角色“普通管理员”，添加新员工时，自动关联角色“普通管理员”。"
                    itemClassName="flex flex-col items-start"
                    textClassName="ml-0 mt-4"
                    descClassName="mb-8 text-caption"
                  />
                  <DepartmentSelectTree
                    store={store.departmentTreeStore}
                    wrapperClassName="flex-1 bg-white rounded-12"
                  />
                </div>
              </>
            ),
          },
        ]}
      />
      <div className="vertical-line flex-grow-0"></div>
      <SelectedList
        className="flex-1"
        ownerStore={store}
      />
    </div>
  );
});

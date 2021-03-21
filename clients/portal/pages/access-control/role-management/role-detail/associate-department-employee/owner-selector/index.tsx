import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';

import { Tab } from '@portal/components/tab2';
import { TextHeader } from '@portal/components/text-header';
import { SearchInput } from '@portal/components/form/search-input';
import { EmployeeTable } from './employee-table';
import { SelectedList } from './selected-list';
import { EmployeeSelectTree } from './employee-select-tree';
import { DepartmentSelectTree } from './department-select-tree';
import { getDepartmentStructure, IOwner } from '@portal/pages/access-control/role-management/api';

import EmployeeTreeStore from './employee-select-tree/store';
import EmployeeStore from './employee-table/store';
import DepartmentTreeStore from './department-select-tree/store';
import OwnerStore from './store';
import { Loading } from '@portal/components/loading2';

export interface IOwnerSelector {
  defaultEmployees?: IOwner[];
  refs: React.MutableRefObject<(() => IOwner[]) | undefined>;
}

export const OwnerSelector = ({ defaultEmployees = [], refs }: IOwnerSelector) => {
  const [store, setStore] = useState<OwnerStore>();

  const { data: department, isLoading, isError } = useQuery(
    ['getDepartmentStructure'],
    getDepartmentStructure,
    {
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    if(department) {
      setStore(new OwnerStore(
        new EmployeeTreeStore(department),
        new EmployeeStore(),
        new DepartmentTreeStore(department),
        defaultEmployees,
      ))
    }
  }, [department, defaultEmployees]);

  refs.current = () => {
    return []
  };

  if(!store) {
    return <Loading desc="加载中..." />
  }

  return (
    <div className="flex flex-row">
      <Tab
        className="mr-8 flex-2"
        currentKey={store.tabKey}
        onChange={key => store.setTabKey(key as string)}
        items={[
          {
            id: '1',
            name: '按员工',
            content: (
              <>
                <SearchInput
                  className="mb-dot-8"
                  name="username"
                  placeholder="搜索员工姓名..."
                  onChange={(value) => store.setUsernameKeyword(value)}
                  appendix="close"
                />
                <div className="flex flex-row mr-4" style={{ height: 'calc(100% - 48px)' }}>
                  <div className="h-full flex flex-col overflow-hidden flex-1 mr-4">
                    <TextHeader className="pb-4" title="选择部门" />
                    <EmployeeSelectTree store={store.employeeTreeStore} />
                  </div>
                  <div className="h-full flex flex-col overflow-hidden flex-2dot5">
                    <TextHeader title={store.employeeTreeStore.currentFocusedNode.name || ''} />
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
                  className="mb-dot-8"
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
                    desc="角色关联部门后，在该部门下添加员工时会默认自动带入该部门的角色。例如：部门关联角色“普通管理员”，添加新员工时，自动关联角色“普通管理员”。"
                    itemClassName="flex flex-col items-start"
                    textClassName="ml-0"
                    descClassName="-ml-dot-4 mb-dot-4"
                  />
                  <DepartmentSelectTree
                    store={store.departmentTreeStore}
                  />
                  {/* <Tree<IDepartmentStructure>
                    treeData={departments}
                    keyword={keyword}
                    className="-ml-2 bg-white rounded-md overflow-scroll text-1-dot-4"
                    itemClassName="cursor-pointer hover:bg-gray-1 text-1-dot-4"
                    selectable
                    multiple
                    selectedClassName="bg-gray-1 text-dark-five"
                    expandOnSelect={false}
                    selectedKeys={selectedDepartmentKeys}
                    onRow={{
                      onClick: (_, __, ___, selectedRows = []) => {
                        if (Array.isArray(selectedRows)) {
                          updateSelectedOwnerFromTree(selectedRows);
                        }
                      },
                    }}
                    appendixRender={(row, isChecked, isIndeterminate, onChange) => {
                      return (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            onChange();
                          }}
                        >
                          <Checkbox
                            checked={isChecked}
                            indeterminate={isIndeterminate}
                            className="flex flex-row items-center"
                            key={row.id}
                            value={row}
                          />
                        </div>
                      );
                    }}
                  /> */}
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
};

import React, { useState, useEffect } from 'react';
import { Checkbox } from '@QCFE/lego-ui';

import { Tab } from '@portal/components/tab';
import { TextHeader } from '@portal/components/text-header';
import { SearchInput } from '@portal/components/form/search-input';
import { EmployeeTable } from './employee-table';
import { SelectedList } from './selected-list';
import { EmployeeSelectTree } from './employee-select-tree';
import { DepartmentSelectTree } from './department-select-tree';
import { IOwner } from '@portal/pages/access-control/role-management/api';
import { TNode } from '@portal/components/headless-tree/types';

export interface IOwnerSelector {
  defaultEmployees?: IOwner[];
  refs: React.MutableRefObject<(() => IOwner[]) | undefined>;
}

export const OwnerSelector = ({ defaultEmployees = [], refs }: IOwnerSelector) => {
  const [keyword, setKeyword] = useState<string>('');
  const [usernameKeyword, setUsernameKeyword] = useState<string>();
  const [tabKey, setTabKey] = useState<string | number>('1');
  const [selectedOwner, setSelectedOwner] = useState<IOwner[]>(defaultEmployees);
  const [selectedDepartmentKeys, setSelectedDepartmentKeys] = useState<string[]>([]);
  const [currentDepartment, setCurrentDepartment] = useState<IDepartment>();

  refs.current = () => selectedOwner;

  useEffect(() => {
    setSelectedDepartmentKeys(
      selectedOwner.filter((owner) => owner.type === 2)
        .map(({ ownerID }) => ownerID)
    );
  }, [selectedOwner]);

  const onClear = () => {
    setSelectedOwner([]);
  };

  const onRemoveItem = (owner: IOwner) => {
    setSelectedOwner((owners) => owners.filter((o) => o.ownerID !== owner.ownerID));
  };

  const updateSelectedOwnerFromTree = (selectedRows: TNode<IDepartment>[]) => {
    let owners = selectedOwner.filter((owner) => owner.type === 2);
    owners = owners.map((owner) => {
      if (!selectedRows.find((row) => row.id === owner.ownerID)) {
        setSelectedOwner(
          (owners) => owners.filter((o) => o?.ownerID !== owner.ownerID)
        );
        return null;
      }
      return owner;
    }).filter(Boolean) as IOwner[];
    selectedRows.forEach((row) => {
      if (!owners.find((owner) => owner.ownerID === row.id)) {
        setSelectedOwner((owners) => [...owners, {
          type: 2,
          ownerID: row.id,
          ownerName: row.data.departmentName,
          phone: '',
          email: '',
          departmentName: row.data.departmentName,
          createdAt: -1,
          id: '',
        }]);
      }
    });
  };

  return (
    <div className="flex flex-row">
      <Tab
        className="mr-4 flex-2"
        currentKey={tabKey}
        onChange={(k) => setTabKey(k)}
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
                  onChange={(value) => setUsernameKeyword(value)}
                  appendix="close"
                />
                <div className="flex flex-row mr-4" style={{ height: 'calc(100% - 48px)' }}>
                  <div className="h-full flex flex-col overflow-hidden flex-1 mr-4">
                    <TextHeader className="pb-4" title="选择部门" />
                    {/* <Tree
                      treeData={departments}
                      className="-ml-2 mr-4 mt-4 overflow-scroll text-dot-7"
                      itemClassName="cursor-pointer hover:bg-white rounded-tl-2xl rounded-bl-2xl"
                      selectable
                      defaultKey={departments[0]?.key}
                      selectedClassName="bg-white text-blue-primary rounded-tl-2xl rounded-bl-2xl"
                      expandOnSelect={false}
                      onRow={{
                        onClick: (node) => setCurrentDepartment(node),
                      }}
                    /> */}
                    <EmployeeSelectTree onChange={setCurrentDepartment} />
                  </div>
                  <div className="h-full flex flex-col overflow-hidden flex-2dot5">
                    <TextHeader title={currentDepartment?.departmentName || ''} />
                    <EmployeeTable
                      userName={usernameKeyword}
                      depID={currentDepartment?.id || ''}
                      className="overflow-scroll"
                      selectedOwner={selectedOwner.filter((owner) => owner.type === 1)}
                      setSelectedOwner={setSelectedOwner}
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
                  onChange={setKeyword}
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
                    onChange={updateSelectedOwnerFromTree}
                    // selectedKeys={selectedDepartmentKeys}
                  />
                  {/* <Tree<IDepartmentStructure>
                    treeData={departments}
                    keyword={keyword}
                    className="-ml-2 bg-white rounded-md overflow-scroll text-dot-7"
                    itemClassName="cursor-pointer hover:bg-gray-1 text-dot-7"
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
        ownerList={selectedOwner}
        onClear={onClear}
        onRemoveItem={onRemoveItem}
      />
    </div>
  );
};

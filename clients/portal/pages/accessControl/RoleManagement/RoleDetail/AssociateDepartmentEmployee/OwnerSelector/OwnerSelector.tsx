import React, { useState, useEffect } from 'react';
import { Checkbox } from '@QCFE/lego-ui';
import { useQuery } from 'react-query';

import { Tab } from '@portal/components/Tab';
import { TextHeader } from '@portal/components/TextHeader';
import { SearchInput } from '@portal/components/form/SearchInput';
import { Tree } from '@portal/components/QxpTree';
import { getDepartmentStructure, IOwner } from '@portal/pages/accessControl/RoleManagement/api';
import { Loading } from '@portal/components/Loading';
import { IDepartmentStructure } from '@portal/pages/accessControl/RoleManagement/api';
import { EmployeeTable } from './EmployeeTable';
import { SelectedList } from './SelectedList';

export interface IOwnerSelector {
  defaultEmployees?: IOwner[];
  refs: React.MutableRefObject<(() => IOwner[]) | undefined>;
}

export const OwnerSelector = ({ defaultEmployees = [], refs }: IOwnerSelector) => {
  const [keyword, setKeyword] = useState<string>('');
  const [usernameKeyword, setUsernameKeyword] = useState<string>();
  const [tabKey, setTabKey] = useState<string | number>('1');
  const [currentDepartment, setCurrentDepartment] = useState<{
    departmentName?: string;
    id?: string;
  }>({});
  const [selectedOwner, setSelectedOwner] = useState<IOwner[]>(defaultEmployees);
  const [selectedDepartmentKeys, setSelectedDepartmentKeys] = useState<string[]>([]);
  const { data: departments = [], isLoading } = useQuery(
      ['getDepartmentStructure'],
      getDepartmentStructure,
      {
        refetchOnWindowFocus: false,
        cacheTime: -1,
      },
  );

  refs.current = () => selectedOwner;

  useEffect(() => {
    setSelectedDepartmentKeys(
        selectedOwner.filter((owner) => owner.type === 2)
            .map(({ ownerID }) => ownerID)
    );
  }, [selectedOwner]);

  useEffect(() => {
    if (departments && departments.length) {
      setCurrentDepartment(departments[0]);
    }
  }, [departments]);

  if (isLoading) {
    return <Loading desc="加载中..." />;
  }

  const onClear = () => {
    setSelectedOwner([]);
  };

  const onRemoveItem = (owner: IOwner) => {
    setSelectedOwner((owners) => owners.filter((o) => o.ownerID !== owner.ownerID));
  };

  const updateSelectedOwnerFromTree = (selectedRows: IDepartmentStructure[]) => {
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
          ownerName: row.departmentName,
          phone: '',
          email: '',
          departmentName: row.parent?.departmentName,
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
                <div className="flex flex-row" style={{ height: 'calc(100% - 48px)' }}>
                  <div className="h-full flex flex-col overflow-hidden flex-1">
                    <TextHeader className="pb-0" title="选择部门" />
                    <Tree
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
                    />
                  </div>
                  <div className="h-full flex flex-col overflow-hidden flex-2dot5">
                    <TextHeader title={currentDepartment.departmentName || ''} />
                    <EmployeeTable
                      userName={usernameKeyword}
                      depID={currentDepartment.id || ''}
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
                  <Tree<IDepartmentStructure>
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
        ownerList={selectedOwner}
        onClear={onClear}
        onRemoveItem={onRemoveItem}
      />
    </div>
  );
};

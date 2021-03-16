import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';

import { Tab } from '@portal/components/Tab';
import { TextHeader } from '@portal/components/TextHeader';
import { uuid } from '@assets/lib/f';
import { SearchInput } from '@portal/components/form/SearchInput';
import { Tree } from '@portal/components/QxpTree';
import { getDepartmentStructure } from '@portal/pages/accessControl/RoleManagement/api';
import { EmployeeTable } from './EmployeeTable';
import { ISelectedListItem, SelectedList } from './SelectedList';
import { Loading } from '@portal/components/Loading';

export const OwnerSelector = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [tabKey, setTabKey] = useState<string | number>('1');
  const [depID, setDepID] = useState<string | null>(null);
  const { data: departments = [], isLoading } = useQuery(
    ['getDepartmentStructure'],
    getDepartmentStructure,
    {
      refetchOnWindowFocus: false,
      cacheTime: -1,
    },
  );

  useEffect(() => {
    if (departments && departments.length) {
      setDepID(departments[0].id as string);
    }
  }, [departments]);

  if (isLoading) {
    return <Loading desc="加载中..." />;
  }

  const selectedList: ISelectedListItem[] = [
    {
      name: 'Jack',
      departmentName: '产品体验部',
      id: uuid(),
    },
    {
      name: 'Jordan',
      departmentName: '质量保障部',
      id: uuid(),
    },
    {
      name: 'Bob',
      departmentName: '产品设计部',
      id: uuid(),
    },
    {
      name: 'Marvin',
      departmentName: '研发部',
      id: uuid(),
    },
    {
      name: 'Scott',
      departmentName: '产品文档部',
      id: uuid(),
    },
  ];

  const onClear = () => {};
  const onRemoveItem = () => {};

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
                  onChange={(value) => {
                    // console.log(value)
                  }}
                  appendix="close"
                />
                <div className="flex flex-row" style={{ height: 'calc(100% - 48px)' }}>
                  <div className="h-full flex flex-col overflow-hidden">
                    <TextHeader className="pb-0" title="选择部门" />
                    <Tree
                      treeData={departments}
                      className="-ml-2 mr-4 mt-4 overflow-scroll"
                      itemClassName="cursor-pointer hover:bg-white rounded-tl-2xl rounded-bl-2xl"
                      selectable
                      selectedClassName="bg-white text-blue-primary rounded-tl-2xl rounded-bl-2xl"
                      expandOnSelect={false}
                      onRow={{
                        onClick: (node) => setDepID(node.id as string),
                      }}
                    />
                  </div>
                  <div className="h-full flex flex-col overflow-hidden flex-1">
                    <TextHeader title="全象云应用开发平台" />
                    <EmployeeTable depID={depID} className="overflow-scroll" />
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
                    descClassName="-ml-dot-4"
                  />
                  <Tree
                    treeData={departments}
                    keyword={keyword}
                    className="-ml-2 bg-white rounded-md overflow-scroll"
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
        ownerList={selectedList}
        onClear={onClear}
        onRemoveItem={onRemoveItem}
      />
    </div>
  );
};

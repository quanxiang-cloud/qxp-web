import React, { useState } from 'react'
import { TreeData } from '@QCFE/lego-ui'

import { Tab } from '@portal/components/Tab'
import { TextHeader } from '@portal/components/TextHeader'
import { UUIDGeneratorBrowser } from '@assets/lib/f'
import { ISelectedListItem, SelectedList } from './SelectedList'
import { SearchInput } from '@portal/components/form/SearchInput'
// import { Tree } from '@portal/components/Tree'
import { Tree } from '@portal/components/TempTree'
import { EmployeeTable } from './EmployeeTable'

export const OwnerSelector = () => {
  const [keyword, setKeyword] = useState<string>('')
  const [tabKey, setTabKey] = useState<string | number>('1')
  const departmentsData: TreeData[] = [
    {
      title: '全象云应用开发平台',
      key: '1',
      children: [
        {
          title: '研发部',
          key: '1-1',
          children: [
            {
              title: '研发一部',
              key: '1-1-1',
              children: [],
            },
            {
              title: '研发二部',
              key: '1-1-2',
              children: [],
            },
          ],
        },
        {
          title: '产品体验部',
          key: '1-2',
          children: [
            {
              title: '质量保证部',
              key: '1-2-1',
              children: [],
            },
            {
              title: '产品设计部',
              key: '1-2-2',
              children: [],
            },
            {
              title: '产品文档部',
              key: '1-2-3',
              children: [],
            },
          ],
        },
        {
          title: '未分配部门',
          key: '2',
          children: [],
        },
      ],
    },
  ]
  const selectedList: ISelectedListItem[] = [
    {
      name: 'Jack',
      departmentName: '产品体验部',
      id: UUIDGeneratorBrowser(),
    },
    {
      name: 'Jordan',
      departmentName: '质量保障部',
      id: UUIDGeneratorBrowser(),
    },
    {
      name: 'Bob',
      departmentName: '产品设计部',
      id: UUIDGeneratorBrowser(),
    },
    {
      name: 'Marvin',
      departmentName: '研发部',
      id: UUIDGeneratorBrowser(),
    },
    {
      name: 'Scott',
      departmentName: '产品文档部',
      id: UUIDGeneratorBrowser(),
    },
  ]

  const onClear = () => {}
  const onRemoveItem = () => {}

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
                <div className="flex flex-row" style={{ height: 'calc(100% - 32px)' }}>
                  <div className="h-full overflow-scroll">
                    <TextHeader className="pb-0" title="选择部门" />
                    <Tree treeData={departmentsData} className="-ml-2" />
                  </div>
                  <div className="h-full overflow-scroll flex-1">
                    <TextHeader title="全象云应用开发平台" />
                    <EmployeeTable />
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
                  className="flex flex-col w-full overflow-scroll"
                  style={{ height: 'calc(100% - 32px)' }}
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
                    treeData={departmentsData}
                    keyword={keyword}
                    className="-ml-2 bg-white rounded-md"
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
  )
}

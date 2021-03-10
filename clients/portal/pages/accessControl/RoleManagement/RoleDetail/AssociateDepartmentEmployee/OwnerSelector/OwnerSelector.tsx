import React from 'react'
import { Tree, TreeData } from '@QCFE/lego-ui'

import { Tab } from '@portal/components/Tab'
import { TextHeader } from '@portal/components/TextHeader'
import { UUIDGeneratorBrowser } from '@assets/lib/f'
import { ISelectedListItem, SelectedList } from './SelectedList'
import { SearchInput } from '@portal/components/form/SearchInput'

export const OwnerSelector = () => {
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
        items={[
          {
            id: UUIDGeneratorBrowser(),
            name: '按员工',
            content: (
              <>
                <SearchInput
                  className="mb-dot-8"
                  name="username"
                  placeholder="搜索员工姓名..."
                  onChange={(value) => {
                    console.log(value)
                  }}
                  appendix="close"
                />
                <div className="flex flex-row" style={{ height: 'calc(100% - 32px)' }}>
                  <div className="h-full overflow-scroll">
                    <TextHeader title="选择部门" />
                    <Tree treeData={departmentsData} />
                  </div>
                  <div>
                    <TextHeader title="全象云应用开发平台" />
                  </div>
                </div>
              </>
            ),
          },
          {
            id: UUIDGeneratorBrowser(),
            name: '按部门',
            content: <>这里要按部门来</>,
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

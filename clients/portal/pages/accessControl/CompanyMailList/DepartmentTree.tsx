import React, { useState } from 'react'
import useCss from 'react-use/lib/useCss'
import { Tree, TreeNode, Dropdown } from '@QCFE/lego-ui'

import { ActionsList, IActionListItem } from '@portal/components/ActionsList'
import { DepartmentModal } from './DepartmentModal'
import { DeleteModal } from './DeleteModal'

interface TreeNodeItem {
  title: string
  id: string
  addDepartment: (val: string, id: string) => void
  [propsName: string]: any
}

const Title = ({ title, id, addDepartment }: TreeNodeItem) => {
  const [handleStatus, setHandleStatus] = useState<'add' | 'edit'>('add')
  const [visibleDepartment, setVisibleDepartment] = useState(false)
  const [visibleDelete, setVisibleDelete] = useState(false)
  const [indexOfNode, setIndexOfNode] = useState(id) // 记录当前点击树节点的id
  // 添加部门 or 修改部门
  const handleDepartment = (status: 'add' | 'edit') => {
    setVisibleDepartment(true)
    setHandleStatus(status)
  }

  //  关闭部门模态框
  const closeDepartmentModal = () => {
    setVisibleDepartment(false)
  }

  //  确定添加部门处理函数
  const okDepartmentModal = (val: any, nodeIndex: string) => {
    setIndexOfNode(nodeIndex) // 更新当前点击树节点的id
    addDepartment(val['department-name'], nodeIndex) // 将新增部门添加为当前点击树节点的子节点
    setVisibleDepartment(false)
  }

  // 删除部门
  const deleteDepartment = () => {
    setVisibleDelete(true)
  }

  // 关闭删除弹窗
  const closeDeleteModal = () => {
    setVisibleDelete(false)
  }

  const actions: IActionListItem<string>[] = [
    {
      id: '1',
      iconName: './dist/images/add-department.svg',
      text: '添加部门',
      onclick: () => handleDepartment('add'),
    },
    {
      id: '2',
      iconName: './dist/images/edit.svg',
      text: '修改部门',
      onclick: () => handleDepartment('edit'),
    },
    {
      id: '3',
      iconName: './dist/images/delete.svg',
      text: '删除',
      onclick: () => deleteDepartment(),
    },
  ]

  return (
    <>
      {/* 部门模态框 */}
      {visibleDepartment && (
        <DepartmentModal
          visible={visibleDepartment}
          status={handleStatus}
          nodeId={indexOfNode}
          closeModal={closeDepartmentModal}
          okModal={okDepartmentModal}
        />
      )}
      {/* 删除模态框 */}
      {visibleDelete && (
        <DeleteModal
          visible={visibleDelete}
          closeModal={closeDeleteModal}
          okModal={closeDeleteModal}
        />
      )}
      <div className="w-full flex items-center justify-between">
        <div className="text-dot-7">{title}</div>
        <div className="h-auto relative">
          <Dropdown content={<ActionsList<string> actions={actions} params={id} />}>
            <span>...</span>
          </Dropdown>
        </div>
      </div>
    </>
  )
}

export const DepartmentTree = () => {
  const [treeData, setTreeData] = useState([
    {
      title: '全象云应用开发平台',
      id: '1',
      key: '1',
      children: [
        {
          title: '分配部门1',
          id: '1-1',
          key: '1-1',
          children: [],
        },
        {
          title: '分配部门2',
          id: '1-2',
          key: '1-2',
          children: [
            {
              title: '第三层部门',
              id: '1-2-1',
              key: '1-2-1',
            },
          ],
        },
      ],
    },
    {
      title: '测试部门',
      id: '2',
      key: '2',
      children: [],
    },
  ])

  // 添加部门节点数据
  const addHandle = (val: string, id: string) => {
    const data = treeData.slice()
    const i = id.split('-').map((item) => {
      return Number(item) - 1
    })

    switch (i.length) {
      case 2:
        data[i[0]].children[i[1]].children.push({
          title: val,
          id: id + '-' + (data[i[0]].children[i[1]].children.length + 1).toString(),
          key: id + '-' + (data[i[0]].children[i[1]].children.length + 1).toString(),
        })
        break
      case 1:
        data[i[0]].children.push({
          title: val,
          id: id + '-' + (data[i[0]].children.length + 1).toString(),
          key: id + '-' + (data[i[0]].children.length + 1).toString(),
          children: [],
        })
        break
      default:
        break
    }

    // 更新treeData的状态
    setTreeData(data)
  }

  const renderTreeNodes = (data: any) =>
    data.map((item: any) => {
      const { children } = item
      if (children) {
        return (
          <TreeNode
            title={<Title {...item} addDepartment={addHandle} />}
            key={item.key}
            dataRef={item}
          >
            {renderTreeNodes(children)}
          </TreeNode>
        )
      }
      return (
        <TreeNode
          title={<Title {...item} addDepartment={addHandle} />}
          key={item.key}
          dataRef={item}
        />
      )
    })

  return (
    <div className="w-auto h-full">
      <Tree
        defaultExpandAll
        className={useCss({
          '.tree-title': {
            width: '100%',
          },
          '.tree-node-wrap': {
            height: '2.7rem',
            padding: '0 1rem',
          },
          '&': {
            'li.tree-node .tree-node-wrap:hover:before': {
              height: '2.7rem',
              'background-color': '#F0F6FF',
              opacity: '0.5',
            },
            'li.tree-node .tree-node-wrap.tree-node-wrap-selected:before': {
              height: '2.7rem',
              'background-color': '#F0F6FF',
              opacity: '1',
            },
            'li.tree-node .tree-node-wrap.tree-node-wrap-selected .tree-title': {
              '> div > .text-dot-7': {
                color: '#375FF3',
              },
              '.text-dot-7': {
                'font-weight': 'normal',
              },
            },
            'li.tree-node span.tree-switcher:hover': {
              background: 'none',
            },
            'li.tree-node .tree-node-content-wrapper': {
              width: '100%',
            },
          },
        })}
      >
        {renderTreeNodes(treeData)}
      </Tree>
    </div>
  )
}

import React, { useState } from 'react'
import useCss from 'react-use/lib/useCss'
import { Tree, TreeNode } from '@QCFE/lego-ui'

interface TreeNodeItem {
  title: string
  id: string
  [propsName: string]: any
}

const Title = ({ title, id }: TreeNodeItem) => {
  const [indexOfNode, setIndexOfNode] = useState(id) // 记录当前点击树节点的id

  return (
    <>
      <div className="w-full flex items-center justify-between">
        <div className="text-dot-7">{title}</div>
      </div>
    </>
  )
}

export const TreeComponent = () => {
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

  const renderTreeNodes = (data: any) =>
    data.map((item: any) => {
      const { children } = item
      if (children) {
        return (
          <TreeNode
            title={<Title {...item} />}
            key={item.key}
            dataRef={item}
          >
            {renderTreeNodes(children)}
          </TreeNode>
        )
      }
      return (
        <TreeNode
          title={<Title {...item} />}
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

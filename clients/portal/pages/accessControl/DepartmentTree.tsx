import React from 'react'
import useCss from 'react-use/lib/useCss'
import classnames from 'classnames'
import { Tree, TreeNode, Icon } from '@QCFE/lego-ui'

interface TreeNodeItem {
  title: string
  [propsName: string]: string
}

export const DepartmentTree = () => {
  const treeData = [
    {
      title: '全象云应用开发平台',
      id: '1',
      key: '0',
      children: [
        {
          title: '分配部门1',
          key: '1-1',
          children: [],
        },
        {
          title: '分配部门2',
          key: '2-1',
          children: [
            {
              title: '第三层部门',
              key: '2-1-1',
            },
          ],
        },
      ],
    },
  ]

  const tree: any[] = treeData

  const Title = ({ title, id }: TreeNodeItem) => {
    console.log(id)
    return (
      <div className="w-full flex items-center justify-between">
        <div className="text-dot-7">{title}</div>
        <div className="h-auto relative">
          <span>...</span>
          {id === '1' && (
            <div className="w-24 z-10 py-dot-8 shadow-title bg-white rounded-dot-6 absolute top-1-dot-6 right-0">
              <ul className="flex flex-col items-center">
                <li
                  className={classnames(
                    'w-full h-1-dot-9 px-dot-8',
                    useCss({
                      '&:hover': {
                        'background-color': '#F0F6FF',
                      },
                    }),
                  )}
                >
                  <span className="mr-2 text-dot-7">?</span>
                  <span className="text-dot-7">添加部门</span>
                </li>
                <li
                  className={classnames(
                    'w-full h-1-dot-9 px-dot-8',
                    useCss({
                      '&:hover': {
                        'background-color': '#F0F6FF',
                      },
                    }),
                  )}
                >
                  <span className="mr-2 text-dot-7">?</span>
                  <span className="text-dot-7">修改信息</span>
                </li>
                <li
                  className={classnames(
                    'w-full h-1-dot-9 px-dot-8',
                    useCss({
                      '&:hover': {
                        'background-color': '#F0F6FF',
                      },
                    }),
                  )}
                >
                  <span className="mr-2 text-dot-7">?</span>
                  <span className="text-dot-7">删除</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderTreeNodes = (data: any) =>
    data.map((item: any) => {
      const { children } = item
      if (children) {
        return (
          <TreeNode title={<Title {...item} />} key={item.key} dataRef={item}>
            {renderTreeNodes(children)}
          </TreeNode>
        )
      }
      return <TreeNode title={<Title {...item} />} key={item.key} dataRef={item} />
    })
  return (
    <div className="w-auto">
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

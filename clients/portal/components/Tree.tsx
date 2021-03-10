import React from 'react'
import useCss from 'react-use/lib/useCss'
import { Tree, TreeNode } from '@QCFE/lego-ui'

interface TreeComponent {
  treeData: any,
  [propsName: string]: any
}

export const TreeComponent = ({treeData}: TreeComponent) => {

  const renderTreeNodes = (data: any) =>
    data.map((item: any) => {
      const { children } = item
      if (children) {
        return (
          <TreeNode
          title={
            <div className="w-full flex items-center justify-between">
              <div className="text-dot-7">{item.title}</div>
            </div>
          }
            key={item.key}
            dataRef={item}
          >
            {renderTreeNodes(children)}
          </TreeNode>
        )
      }
      return (
        <TreeNode
          title={
            <div className="w-full flex items-center justify-between">
              <div className="text-dot-7">{item.title}</div>
            </div>
          }
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

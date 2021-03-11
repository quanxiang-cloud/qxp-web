import React, { useState, useEffect } from 'react'
import { TreeData, TreeProps, TreeNodeProps, Icon } from '@QCFE/lego-ui'
import { twCascade } from '@mariusmarais/tailwind-cascade'

import { deepClone } from '@assets/lib/f'

interface ITreeData extends TreeData {
  icon?: JSX.Element
}
interface ITree extends TreeProps {
  treeData: ITreeData[]
  keyword?: string
  visible?: boolean
}

export const Tree = ({ treeData, keyword, visible = true }: ITree) => {
  const [dataSource, setDataSource] = useState<ITreeData[]>(deepClone(treeData))

  const buildDataSourceWithKeyword = (data: ITreeData[], k: string): ITreeData[] => {
    const newData = []
    for (let item of data) {
      if (item.title.includes(k)) {
        newData.push(item)
        break
      } else if (item.children) {
        newData.push(...buildDataSourceWithKeyword(item.children, k))
      }
    }
    return newData
  }

  useEffect(() => {
    if (keyword) {
      setDataSource((data) => {
        const newData = buildDataSourceWithKeyword(data, keyword)
        console.log(newData)
        return newData
      })
    } else {
      setDataSource(treeData)
    }
  }, [keyword])

  return (
    <ul
      className={twCascade('flex flex-col transition-all', {
        'h-0': !visible,
        'overflow-hidden': !visible,
      })}
    >
      {dataSource.map((node) => (
        <TreeNode node={node} key={node.key} keyword={keyword} />
      ))}
    </ul>
  )
}

interface ITreeNode extends TreeNodeProps {
  node: ITreeData
  keyword?: string
}
const TreeNode = ({ node, keyword }: ITreeNode) => {
  const [childVisible, setChildVisible] = useState(false)
  const hasChild = node.children && !!node.children.length

  return (
    <li className="px-4">
      <div
        className="flex flex-col"
        onClick={(e) => {
          e.stopPropagation()
          setChildVisible((v) => !v)
        }}
      >
        <div className="flex items-center">
          {hasChild && (
            <div
              className={twCascade('transition transform', {
                '-rotate-90': childVisible,
              })}
            >
              <Icon name="caret-right" />
            </div>
          )}
          <div>
            {node.icon && <span>{node.icon}</span>}
            {keyword && node.title.includes(keyword) ? (
              <span className="text-red-400">{node.title}</span>
            ) : (
              <>{node.title}</>
            )}
          </div>
        </div>
        {hasChild && <Tree treeData={node.children} keyword={keyword} visible={childVisible} />}
      </div>
    </li>
  )
}

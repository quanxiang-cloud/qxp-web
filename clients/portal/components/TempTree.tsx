import React, { useState } from 'react'
import { TreeData, TreeProps, TreeNodeProps, Icon } from '@QCFE/lego-ui'

interface ITreeData extends TreeData {
  icon?: JSX.Element
}
interface ITree extends TreeProps {
  treeData: ITreeData[]
}

const Tree = ({ treeData }: ITree) => {
  return (
    <ul className="flex flex-col">
      {treeData.map((tree) => (
        <TreeNode node={tree} key={tree.key} />
      ))}
    </ul>
  )
}

interface ITreeNode extends TreeNodeProps {
  node: ITreeData
}
const TreeNode = ({ node }: ITreeNode) => {
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
            <div className="transition -rotate-90">
              <Icon name="caret-right" />
            </div>
          )}
          <div>
            {node.icon && <span>{node.icon}</span>}
            {node.title}
          </div>
        </div>
        {hasChild && childVisible && <Tree treeData={node.children} />}
      </div>
    </li>
  )
}

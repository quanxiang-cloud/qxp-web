import React from 'react';
import { Tree, TreeNode } from '@QCFE/lego-ui';

type Props = {
  onSelect: (treeNode: any) => void;
  treeData: any;
}

function TreeCom({ onSelect, treeData }: Props) {
  const renderTreeNodes = (childData: any[]) =>
    childData.length > 0 &&
    childData.map((treeNode: any) => {
      const { child } = treeNode;
      if (child) {
        return (
          <TreeNode
            title={<div onClick={() => onSelect(treeNode)} className="w-full">{treeNode.departmentName}</div>}
            key={treeNode.id}
            dataRef={treeNode}
          >
            {renderTreeNodes(child)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          title={<div onClick={() => onSelect(treeNode)} className="w-full">{treeNode.departmentName}</div>}
          key={treeNode.id}
          dataRef={treeNode}
        />
      );
    });

  return (
    <Tree defaultExpandAll>
      {treeData.length > 0 ? renderTreeNodes(treeData) : null}
    </Tree>
  )
}

export default TreeCom;
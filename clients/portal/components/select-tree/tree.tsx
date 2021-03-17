import React from 'react';
import { Tree, TreeNode } from '@QCFE/lego-ui';

function TreeCom({ onSelect, treeData }) {
  const renderTreeNodes = (childData: any[]) =>
    childData.length > 0 &&
    childData.map((treenode: any) => {
      const { child } = treenode;
      if (child) {
        return (
          <TreeNode
            title={<div onClick={() => onSelect(treenode)} className="w-full">{treenode.departmentName}</div>}
            key={treenode.id}
            dataRef={treenode}
          >
            {renderTreeNodes(child)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          title={<div onClick={() => onSelect(treenode)} className="w-full">{treenode.departmentName}</div>}
          key={treenode.id}
          dataRef={treenode}
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
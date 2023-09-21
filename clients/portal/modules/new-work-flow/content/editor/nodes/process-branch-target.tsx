import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

import ProcessBranchTargetNodeComponent from '../components/process-branch-target';

export default function ProcessBranchTargetNode(props: any): JSX.Element {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={false}
      />
      <ProcessBranchTargetNodeComponent {...props} />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={false}
      />
    </>
  );
}

import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

import ProcessBranchNodeComponent from '../components/process-branch';

export default function ProcessBranchNode(props: any): JSX.Element {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={false}
      />
      <ProcessBranchNodeComponent {...props} />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={false}
      />
    </>
  );
}

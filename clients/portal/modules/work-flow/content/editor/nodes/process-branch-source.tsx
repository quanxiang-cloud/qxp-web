import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

import ProcessBranchSourceNodeComponent from '../components/process-branch-source';

export default function ProcessBranchSourceNode(props: any): JSX.Element {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={false}
      />
      <ProcessBranchSourceNodeComponent {...props} />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={false}
      />
    </>
  );
}

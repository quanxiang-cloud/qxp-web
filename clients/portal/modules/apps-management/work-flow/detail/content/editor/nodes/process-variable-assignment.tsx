import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

import ProcessVariableAssignmentNodeComponent from '../components/process-variable-assignment';

export default function ProcessVariableAssignmentNode(props: any): JSX.Element {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={false}
      />
      <ProcessVariableAssignmentNodeComponent {...props} />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={false}
      />
    </>
  );
}

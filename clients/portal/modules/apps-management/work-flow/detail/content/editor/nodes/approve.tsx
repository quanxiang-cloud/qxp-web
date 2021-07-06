import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

import ApproveNodeComponent from '../components/approve';

export default function ApproveNode(props: any): JSX.Element {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
      />
      <ApproveNodeComponent {...props} />
      <Handle
        type="source"
        position={Position.Bottom}
      />
    </>
  );
}

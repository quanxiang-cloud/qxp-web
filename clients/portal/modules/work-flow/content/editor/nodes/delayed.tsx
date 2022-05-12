import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

import DelayedNodeComponent from '../components/delayed';

export default function SendEmailNode(props: any): JSX.Element {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={false}
      />
      <DelayedNodeComponent {...props} />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={false}
      />
    </>
  );
}

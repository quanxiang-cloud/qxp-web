import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

import DelayedNodeComponent from '../components/timer-start';

export default function DelayedNode(props: any): JSX.Element {
  return (
    <>
      <DelayedNodeComponent {...props} />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={false}
      />
    </>
  );
}

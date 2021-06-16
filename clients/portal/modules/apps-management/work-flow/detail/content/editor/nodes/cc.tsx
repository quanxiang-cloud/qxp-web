import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

import CCNodeComponent from '../components/cc';

export default function CCNode(props: any): JSX.Element {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
      />
      <CCNodeComponent {...props} />
      <Handle
        type="source"
        position={Position.Bottom}
      />
    </>
  );
}

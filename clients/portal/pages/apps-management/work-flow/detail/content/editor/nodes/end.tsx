import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

import End from '../components/end';

export default function EndNode(props: any) {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
      />
      <End {...props} />
    </>
  );
}

import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

import EndNodeComponent from '../components/end';

export default function EndNode(props: any) {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
      />
      <EndNodeComponent {...props} />
    </>
  );
}

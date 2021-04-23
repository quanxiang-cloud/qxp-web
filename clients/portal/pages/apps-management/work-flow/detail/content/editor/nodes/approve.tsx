import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

import Approve from '../components/approve';

export default function FormDataNode(props: any) {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
      />
      <Approve {...props} />
      <Handle
        type="source"
        position={Position.Bottom}
      />
    </>
  );
}

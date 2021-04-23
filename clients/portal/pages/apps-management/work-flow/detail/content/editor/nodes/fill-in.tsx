import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

import FillIn from '../components/fill-in';

export default function FormDataNode(props: any) {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
      />
      <FillIn {...props} />
      <Handle
        type="source"
        position={Position.Bottom}
      />
    </>
  );
}

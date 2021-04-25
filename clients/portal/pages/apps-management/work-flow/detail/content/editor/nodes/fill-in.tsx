import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

import FillInNodeComponent from '../components/fill-in';

export default function FormDataNode(props: any) {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
      />
      <FillInNodeComponent {...props} />
      <Handle
        type="source"
        position={Position.Bottom}
      />
    </>
  );
}

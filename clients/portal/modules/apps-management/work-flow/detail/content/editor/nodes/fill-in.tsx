import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

import FillInNodeComponent from '../components/fill-in';

export default function FillInNode(props: any): JSX.Element {
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

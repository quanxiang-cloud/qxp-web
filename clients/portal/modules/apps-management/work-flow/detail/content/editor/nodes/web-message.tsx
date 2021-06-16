import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

import WebMessageNodeComponent from '../components/web-message';

export default function WebMessageNode(props: any): JSX.Element {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
      />
      <WebMessageNodeComponent {...props} />
      <Handle
        type="source"
        position={Position.Bottom}
      />
    </>
  );
}

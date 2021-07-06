import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

import SendEmailNodeComponent from '../components/send-email';

export default function SendEmailNode(props: any): JSX.Element {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
      />
      <SendEmailNodeComponent {...props} />
      <Handle
        type="source"
        position={Position.Bottom}
      />
    </>
  );
}

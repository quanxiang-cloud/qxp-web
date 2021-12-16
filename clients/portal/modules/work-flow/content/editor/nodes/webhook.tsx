import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

import WebhookNodeComponent from '../components/webhook';

export default function WebHookNode(props: any): JSX.Element {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={false}
      />
      <WebhookNodeComponent {...props} />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={false}
      />
    </>
  );
}

import React from 'react';

import NodeComponentWrapper, { Props } from './node-component-wrapper';

export default function WebhookNodeComponent(props: Props): JSX.Element {
  return (
    <NodeComponentWrapper
      {...props}
      iconName="code"
      headerClassName="bg-cyan-500"
      titleClassName="bg-cyan-500"
    >
      <div className="text-caption-no-color bg-gray-100 py-4 px-8 rounded-4">
        设置节点:
      </div>
    </NodeComponentWrapper>
  );
}

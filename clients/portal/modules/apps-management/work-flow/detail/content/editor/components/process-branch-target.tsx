import React from 'react';

import NodeComponentWrapper, { Props } from './node-component-wrapper';

export default function ProcessBranchTargetNodeComponent(props: Props): JSX.Element {
  const { width, height } = props.data.nodeData;
  return (
    <NodeComponentWrapper {...props} simple>
      <div
        className="h-full flex items-center justify-center whitespace-nowrap p-1 cursor-pointer"
        style={{ width, height }}
      >
        合流
      </div>
    </NodeComponentWrapper>
  );
}


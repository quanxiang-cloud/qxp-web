import React from 'react';

import NodeComponentWrapper, { Props } from './node-component-wrapper';

export default function WebMessageNodeComponent(props: Props): JSX.Element {
  return (
    <NodeComponentWrapper {...props}>
      {(props.data.businessData as Record<string, any>)?.name || '站内信'}
    </NodeComponentWrapper>
  );
}

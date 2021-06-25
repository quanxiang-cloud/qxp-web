import React from 'react';

import NodeComponentWrapper, { Props } from './node-component-wrapper';

export default function CCNodeComponent(props: Props): JSX.Element {
  return (
    <NodeComponentWrapper {...props}>
      {(props.data.businessData as Record<string, any>)?.name || '抄送'}
    </NodeComponentWrapper>
  );
}

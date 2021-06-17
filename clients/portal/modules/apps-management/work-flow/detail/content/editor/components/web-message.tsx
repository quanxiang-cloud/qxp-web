import React from 'react';

import NodeComponentWrapper, { Props } from './node-component-wrapper';

export default function WebMessageNodeComponent(props: Props): JSX.Element {
  return (
    <NodeComponentWrapper {...props}>站内信</NodeComponentWrapper>
  );
}

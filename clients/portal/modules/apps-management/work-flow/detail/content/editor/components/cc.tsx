import React from 'react';

import NodeComponentWrapper, { Props } from './node-component-wrapper';

export default function CCNodeComponent(props: Props): JSX.Element {
  return (
    <NodeComponentWrapper {...props}>抄送</NodeComponentWrapper>
  );
}

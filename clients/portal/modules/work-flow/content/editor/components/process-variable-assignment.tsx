import React from 'react';

import NodeComponentWrapper, { Props } from './node-component-wrapper';

export default function ProcessVariableAssignmentNodeComponent(props: Props): JSX.Element {
  return (
    <NodeComponentWrapper {...props}>变更流程参数</NodeComponentWrapper>
  );
}

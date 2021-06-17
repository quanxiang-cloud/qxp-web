import React from 'react';

import NodeComponentWrapper, { Props } from './node-component-wrapper';

export default function ProcessBranchNodeComponent(props: Props): JSX.Element {
  return (
    <NodeComponentWrapper {...props}>分支节点</NodeComponentWrapper>
  );
}

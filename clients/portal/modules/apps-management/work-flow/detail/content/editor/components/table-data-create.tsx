import React from 'react';

import NodeComponentWrapper, { Props } from './node-component-wrapper';

export default function TableDataCreateNodeComponent(props: Props): JSX.Element {
  return (
    <NodeComponentWrapper {...props}>数据新增</NodeComponentWrapper>
  );
}

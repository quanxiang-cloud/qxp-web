import React from 'react';

import NodeComponentWrapper, { Props } from './node-component-wrapper';

export default function TableDataUpdateNodeComponent(props: Props): JSX.Element {
  return (
    <NodeComponentWrapper {...props} iconName="update">数据更新</NodeComponentWrapper>
  );
}

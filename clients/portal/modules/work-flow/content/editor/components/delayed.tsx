import React from 'react';

import NodeComponentWrapper, { Props } from './node-component-wrapper';

export default function SendEmailNodeComponent(props: Props): JSX.Element {
  // const approvePersons = approvePersonEncoder(props.data.businessData);
  return (
    <NodeComponentWrapper {...props} iconName="email">
      <div className="text-caption-no-color bg-gray-100 py-4 px-8 rounded-4">
        延时节点
      </div>
    </NodeComponentWrapper>
  );
}

import React from 'react';

import NodeComponentWrapper, { Props } from './node-component-wrapper';
import { getPerson, approvePersonEncoder } from './_common/utils';

export default function SendEmailNodeComponent(props: Props): JSX.Element {
  const approvePersons = approvePersonEncoder(props.data.businessData);

  return (
    <NodeComponentWrapper {...props} iconName="email">
      <div className="text-caption-no-color bg-gray-100 py-4 px-8 rounded-4">
        接收对象:
        <span className="text-gray-600">{getPerson(approvePersons)}</span>
      </div>
    </NodeComponentWrapper>
  );
}

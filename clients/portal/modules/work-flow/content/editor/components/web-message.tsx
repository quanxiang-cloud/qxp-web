import React from 'react';

import NodeComponentWrapper, { Props } from './node-component-wrapper';

import { WebMessageData } from '../type';
import { getPerson } from './_common/utils';

export default function WebMessageNodeComponent(props: Props): JSX.Element {
  const { approvePersons } = props.data.businessData as WebMessageData;
  return (
    <NodeComponentWrapper {...props} iconName="message">
      <div className="text-caption-no-color bg-gray-100 py-4 px-8 rounded-4">
        接收对象:
        <span className="text-gray-600">{getPerson(approvePersons)}</span>
      </div>
    </NodeComponentWrapper>
  );
}

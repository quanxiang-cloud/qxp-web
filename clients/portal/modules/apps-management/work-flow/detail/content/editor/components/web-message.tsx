import React from 'react';

import NodeComponentWrapper, { Props } from './node-component-wrapper';

import { WebMessageData } from '../type';

export default function WebMessageNodeComponent(props: Props): JSX.Element {
  const { recivers } = props.data.businessData as WebMessageData;
  return (
    <NodeComponentWrapper {...props}>
      {recivers && recivers.length ? (
        <div className="text-caption-no-color bg-gray-100 py-4 px-8 rounded-4">
          接收对象: <span className="text-gray-600">
            {recivers.map(({ name }) => name).join(',')}
          </span>
        </div>
      ) : '站内信'}
    </NodeComponentWrapper>
  );
}

import React from 'react';

import NodeComponentWrapper, { Props } from './node-component-wrapper';

import { CCData } from '../type';

export default function CCNodeComponent(props: Props): JSX.Element {
  const { type, recivers } = props.data.businessData as CCData;
  return (
    <NodeComponentWrapper {...props} iconName="info">
      <div className="text-caption-no-color bg-gray-100 py-4 px-8 rounded-4">
        接收对象:
        {type !== 'person' ? '流程发起人' : (
          <span className="text-gray-600">
            {recivers.map(({ name })=>name).join(',')}
          </span>
        )}
      </div>
    </NodeComponentWrapper>
  );
}

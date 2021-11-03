import React from 'react';

import Icon from '@c/icon';

import NodeWrapper from './wrapper';

export default function InputNode(props: POLY_API.NodeProps): JSX.Element | null {
  return (
    <NodeWrapper {...props}>
      <div className="flex justify-center items-center flex-nowrap">
        <Icon name="play_circle_filled" size={16} className="mr-4 text-blue-600" />
        <span className="mr-2 text-blue-600 text-caption-no-color-weight">配置开始节点</span>
        <Icon name="chevron_right" size={16} className="text-blue-600" />
      </div>
    </NodeWrapper>
  );
}

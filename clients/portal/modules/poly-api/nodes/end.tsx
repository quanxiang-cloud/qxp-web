import React from 'react';
import { NodeProps } from 'react-flow-renderer';

import Icon from '@c/icon';

import NodeWrapper from './wrapper';

export default function EndNode(props: NodeProps<POLY_API.SubjectPolyNode>): JSX.Element | null {
  return (
    <NodeWrapper {...props}>
      <div className="flex justify-center items-center flex-nowrap">
        <Icon name="play_circle_filled" size={16} className="mr-4 text-blue-600" />
        <span className="mr-2 text-blue-600 text-caption-no-color-weight">配置结束节点</span>
        <Icon name="chevron_right" size={16} className="text-blue-600" />
      </div>
    </NodeWrapper>
  );
}

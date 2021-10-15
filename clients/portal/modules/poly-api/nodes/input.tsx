import React from 'react';
import { NodeProps } from 'react-flow-renderer';

import NodeWrapper from './wrapper';
import RightHandle from './handle/right';

import Icon from '@c/icon';

export default function InputNode(props: NodeProps<POLY_API.PolyNode>): JSX.Element | null {
  if (props.data.detail?.type !== 'input') {
    return null;
  }

  return (
    <>
      <NodeWrapper rightTrigger isSelected={props.selected}>
        <div className="flex justify-center items-center flex-nowrap">
          <Icon name="play_circle_filled" size={16} className="mr-4 text-blue-600" />
          <span className="mr-2 text-blue-600 text-caption-no-color-weight">配置开始节点</span>
          <Icon name="chevron_right" size={16} className="text-blue-600" />
        </div>
      </NodeWrapper>
      <RightHandle id={props.data.handles.right} />
    </>
  );
}

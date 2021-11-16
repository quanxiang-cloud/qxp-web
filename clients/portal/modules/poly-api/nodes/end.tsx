import React from 'react';
import { NodeProps } from 'react-flow-renderer';

import Icon from '@c/icon';

import NodeWrapper from './wrapper';
import useNodeConfig from '../effects/hooks/use-node-config';
import endConfigSchema from './forms/end/schema';

export default function EndNode(props: NodeProps<POLY_API.SubjectPolyNode>): JSX.Element | null {
  const [isConfigShow, setIsConfigShow] = React.useState(false);

  useNodeConfig({
    visible: isConfigShow,
    currentNode: props.data,
    schema: endConfigSchema,
    onClose: () => setIsConfigShow(false),
    excludedFields: ['apiDoc'],
  });

  function showConfig(): void {
    setIsConfigShow(true);
  }

  return (
    <NodeWrapper {...props}>
      <div
        className="flex justify-center items-center flex-nowrap"
        onClick={showConfig}
      >
        <Icon name="play_circle_filled" size={16} className="mr-4 text-blue-600" />
        <span className="mr-2 text-blue-600 text-caption-no-color-weight">配置结束节点</span>
        <Icon name="chevron_right" size={16} className="text-blue-600" />
      </div>
    </NodeWrapper>
  );
}

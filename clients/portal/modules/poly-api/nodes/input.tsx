import React from 'react';

import Icon from '@c/icon';

import NodeWrapper from './wrapper';
import useNodeConfig from '../effects/hooks/use-node-config';
import InputConfigSchema from './forms/input-config-schema';

export default function InputNode(props: POLY_API.NodeProps): JSX.Element | null {
  const [isConfigShow, setIsConfigShow] = React.useState(false);

  useNodeConfig({
    visible: isConfigShow,
    currentNode: props.data,
    schema: InputConfigSchema,
    onClose: () => setIsConfigShow(false),
  });

  function showConfig(): void {
    setIsConfigShow(true);
  }

  return (
    <NodeWrapper {...props}>
      <div className="flex justify-center items-center flex-nowrap" onClick={showConfig}>
        <Icon name="play_circle_filled" size={16} className="mr-4 text-blue-600" />
        <span className="mr-2 text-blue-600 text-caption-no-color-weight">配置开始节点</span>
        <Icon name="chevron_right" size={16} className="text-blue-600" />
      </div>
    </NodeWrapper>
  );
}

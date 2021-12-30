import React from 'react';

import NodeComponentWrapper, { Props } from './node-component-wrapper';
import { WebhookData } from '../type';

export default function WebhookNodeComponent(props: Props): JSX.Element {
  const { data } = props;
  const { config: { url }, type } = data.businessData as WebhookData;

  return (
    <NodeComponentWrapper
      {...props}
      iconName="code"
      headerClassName="bg-cyan-500"
      titleClassName="bg-cyan-500"
    >
      <div className="text-caption-no-color bg-gray-100 py-4 px-8 rounded-4 truncate whitespace-nowrap">
        <span className="text-gray-400">设置节点: </span>
        <span className="text-gray-600" title={url}>
          {(type === 'request' ? '获取 ' : '推送 ') + url}
        </span>
      </div>
    </NodeComponentWrapper>
  );
}

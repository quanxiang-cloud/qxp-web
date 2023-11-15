import React from 'react';

import NodeComponentWrapper, { Props } from './node-component-wrapper';
import { WebhookData } from '../type';

export default function WebhookNodeComponent(props: Props): JSX.Element {
  const { data } = props;
  const businessData = data.businessData as WebhookData;

  const url = businessData.config.sendUrl;
  const desc = businessData.type === 'request' ? '获取 ' : '推送 ';

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
          {`${url ? `${desc}${url}` : '未配置'}`}
        </span>
      </div>
    </NodeComponentWrapper>
  );
}

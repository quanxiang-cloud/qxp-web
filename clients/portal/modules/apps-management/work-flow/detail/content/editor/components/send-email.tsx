import React from 'react';

import NodeComponentWrapper, { Props } from './node-component-wrapper';

export default function SendEmailNodeComponent(props: Props): JSX.Element {
  return (
    <NodeComponentWrapper {...props}>
      {(props.data.businessData as Record<string, any>)?.name || '发送邮件'}
    </NodeComponentWrapper>
  );
}

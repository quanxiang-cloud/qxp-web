import React from 'react';

import NodeComponentWrapper, { Props } from './node-component-wrapper';

export default function SendEmailNodeComponent(props: Props): JSX.Element {
  return (
    <NodeComponentWrapper {...props}>发送邮件</NodeComponentWrapper>
  );
}

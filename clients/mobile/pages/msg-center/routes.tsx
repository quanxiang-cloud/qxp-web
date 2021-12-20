import React from 'react';
import SubRoutePage from '@m/components/sub-route-page';
import { messageDetailPath } from '@m/constant';
import MessageDetail from '@m/pages/msg-center/detail';
import Messages from '@m/pages/msg-center/messages';

export default function Routes(): JSX.Element {
  return (
    <SubRoutePage subRoutes={{ path: messageDetailPath, component: MessageDetail }}>
      <Messages />
    </SubRoutePage>
  );
}

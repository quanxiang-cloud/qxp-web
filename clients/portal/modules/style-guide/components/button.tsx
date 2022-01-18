import React from 'react';

// @ts-ignore
import { Button, buttonStyleConfigInterface } from '@ofa/ui-test';

export default {
  key: 'button',
  name: 'Button 按钮',
  schemas: buttonStyleConfigInterface,
  Component: (props: any): JSX.Element => <Button {...props}>Preview</Button>,
} as ComponentPackagingObject;

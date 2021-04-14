import React from 'react';
import { Button } from 'antd';

const CircleButton = props => {
  const hasText = String(props.className || '').indexOf('has-text') > -1;
  return (
    <Button type={hasText ? 'link' : undefined} shape={hasText ? undefined : 'circle'} {...props} />
  );
};
export default CircleButton;

import React, { forwardRef, ReactNode, Ref, useState } from 'react';
import { Input, InputInstance, InputProps } from '@m/qxp-ui-mobile/input';
import Icon from '@m/qxp-ui-mobile/icon';

function PasswordInput(props: InputProps, ref: Ref<InputInstance>): JSX.Element {
  const [type, setType] = useState('password');

  function renderIcon(): ReactNode {
    return (
      <Icon
        name={type === 'password' ? 'visibility_off' : 'visibility'}
        onClick={() => setType(type === 'text' ? 'password' : 'text')}
        size='.44rem'
        className='padding-12'
      />
    );
  }

  return (
    <Input
      {...props}
      ref={ref}
      type={type}
      maxLength={128}
      renderAfter={renderIcon()}
    />
  );
}
export default forwardRef(PasswordInput);

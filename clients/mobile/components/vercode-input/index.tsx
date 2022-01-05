import React, { forwardRef, ReactNode, Ref, useState } from 'react';
import cs from 'classnames';

import { Input, InputInstance, InputProps } from '@m/qxp-ui-mobile/input';
import { checkVerifyCode } from '@m/lib/validators';
import useCountDown from '@m/lib/hooks/use-count-down';

interface VerCodeInputProps extends InputProps {
  onSendVerCode: () => Promise<boolean>;
}

function VerCodeInput(props: VerCodeInputProps, ref: Ref<InputInstance>): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const { start, reset, current } = useCountDown({
    time: 60000,
    onFinish: () => {
      setDisabled(false);
      reset();
    },
  });

  function onLinkClick(): void {
    if (loading || disabled) return;
    setLoading(true);
    props.onSendVerCode().then((res) => {
      setLoading(false);
      if (res) {
        start();
        setDisabled(true);
      }
    }).catch(() => setLoading(false));
  }

  function renderLink(): ReactNode {
    return (
      <div
        className={cs('body1 padding-10-12 text-highlight', {
          'opacity-60': loading || disabled,
        })}
        onClick={onLinkClick}
      >
        {loading && '获取中...'}
        {!loading && (disabled ? `${current.seconds + 1} 秒后重试` : '获取验证码')}
      </div>
    );
  }

  return (
    <Input
      {...props}
      ref={ref}
      maxLength={6}
      renderAfter={renderLink()}
      validate={checkVerifyCode}
      type='text'
    />
  );
}
export default forwardRef(VerCodeInput);

import React, { useRef, useState } from 'react';

import NavPage from '@m/components/nav-page';
import PasswordInput from '@m/components/password-input';
import { checkPassword, checkPhoneEmail } from '@m/lib/validators';
import Button from '@m/qxp-ui-mobile/button';
import { Input, InputInstance } from '@m/qxp-ui-mobile/input';
import toast from '@lib/toast';
import Icon from '@m/qxp-ui-mobile/icon';
import VerCodeInput from '@m/components/vercode-input';
// import httpClient from '@lib/http-client';

export default function ForgetPwd(): JSX.Element {
  const usernameRef = useRef<InputInstance>(null);
  const codeRef = useRef<InputInstance>(null);
  const passwordRef = useRef<InputInstance>(null);
  const [loading, setLoading] = useState(false);

  async function callSendApi(): Promise<boolean> {
    const usernameError = usernameRef?.current?.validate();
    if (usernameError) return false;
    try {
      // await httpClient.get(
      //   '/api/v1/org/h/account/forget/code',
      //   { userName: usernameRef?.current?.value },
      //   { 'X-Proxy': 'API-NO-AUTH' },
      // );
      return true;
    } catch (e) {
      toast.error(e);
      return false;
    }
  }

  function onSubmit(): void {
    // We must run all the errors check fist,
    // Because the user may submit without entering.
    const usernameError = usernameRef?.current?.validate();
    const codeError = codeRef?.current?.validate();
    const passwordError = passwordRef?.current?.validate();
    if (usernameError || codeError || passwordError) {
      passwordRef?.current?.blur?.();
      return;
    }
    setLoading(true);
    // httpClient(
    //   '/api/v1/warden/org/h/account/forget/reset',
    //   {
    //     userName: usernameRef?.current?.value,
    //     newPassword: passwordRef?.current?.value,
    //     code: codeRef?.current?.value,
    //   },
    //   { 'X-Proxy': 'API-NO-AUTH' },
    // ).then(() => {
    //   setLoading(false);
    //   toast.success('密码修改成功');
    //   window.location.pathname = '/login/password';
    // }).catch((e) => {
    //   toast.error(e);
    //   setLoading(false);
    // });
  }

  return (
    <NavPage title='忘记密码' absolute className='flex flex-col padding-16-12 text-secondary'>
      <div className='flex-1'>
        <div className='relative body2 text-placeholder align-middle' style={{ marginBottom: '.24rem' }}>
          <Icon name='info' size='.2rem' className='absolute' style={{ top: '.05rem' }}/>
          <div style={{ width: '.22rem', height: '.2rem', display: 'inline-block' }}/>
          <span className='body2 text-placeholder'>
            通过手机号或邮箱重置密码，若无法重置，可联系企业管理员修改
          </span>
        </div>
        <p className='mb-8'>手机号/邮箱</p>
        <Input
          ref={usernameRef}
          validate={checkPhoneEmail}
          enterKeyHint='next'
          type='email'
          onEnterPress={() => codeRef?.current?.focus?.()}
          placeholder='输入手机号或邮箱'
        />
        <p className='mt-16 mb-8'>验证码</p>
        <VerCodeInput
          ref={codeRef}
          enterKeyHint='next'
          onSendVerCode={callSendApi}
          onEnterPress={() => passwordRef?.current?.focus?.()}
          placeholder='输入验证码'
        />
        <p className='mt-16 mb-8'>新密码</p>
        <PasswordInput
          ref={passwordRef}
          validate={checkPassword}
          enterKeyHint='go'
          onEnterPress={onSubmit}
          placeholder='输入新密码'
        />
      </div>

      <Button
        block
        className='mb-12 safe-area-bottom'
        loadingText='提交中'
        loading={loading}
        onClick={onSubmit}
      >
      提交
      </Button>
    </NavPage>
  );
}

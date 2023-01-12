import React, { useRef, useState } from 'react';

import NavPage from '@m/components/nav-page';
import { forgetPwdPath } from '@m/constant';
import Button from '@m/qxp-ui-mobile/button';
import PasswordInput from '@m/components/password-input';
import Link from '@m/qxp-ui-mobile/link';
import { checkPassword } from '@m/lib/validators';
import { InputInstance } from '@m/qxp-ui-mobile/input';
import { userResetPassword } from '@lib/api/auth';
import toast from '@lib/toast';

export default function ChangePwd(): JSX.Element {
  const originRef = useRef<InputInstance>(null);
  const newRef = useRef<InputInstance>(null);
  const [loading, setLoading] = useState(false);

  function onSubmit(): void {
    // We must run all the errors check fist,
    // Because the user may submit without entering.
    const originError = originRef?.current?.validate();
    const newError = newRef?.current?.validate();
    if (originError || newError) {
      newRef?.current?.blur?.();
      return;
    }
    setLoading(true);
    userResetPassword({
      old: originRef?.current?.value ?? '',
      new: newRef?.current?.value ?? '',
    }).then(() => {
      setLoading(false);
      toast.success('密码修改成功');
      window.location.pathname = '/login';
    }).catch((e) => {
      toast.error(e);
      setLoading(false);
    });
  }

  return (
    <NavPage title='修改密码' absolute className='flex flex-col padding-16-12 text-secondary'>
      <div className='flex-1'>
        <p className='mb-8'>原密码</p>
        <PasswordInput
          ref={originRef}
          validate={checkPassword}
          enterKeyHint='next'
          onEnterPress={() => newRef?.current?.focus?.()}
          placeholder='输入原密码'
        />
        <p className='mt-16 mb-8'>新密码</p>
        <PasswordInput
          ref={newRef}
          validate={checkPassword}
          enterKeyHint='go'
          onEnterPress={onSubmit}
          placeholder='输入新密码'
        />

        <Link
          href={forgetPwdPath}
          className='body2 padding-8'
          target='_history'
          style={{ margin: '0 -0.08rem -0.08rem -0.08rem' }}
        >
            忘记原密码？
        </Link>
      </div>

      <Button
        block
        className='mb-12 safe-area-bottom'
        loadingText='修改中'
        loading={loading}
        onClick={onSubmit}
      >
          确定修改
      </Button>
    </NavPage>
  );
}

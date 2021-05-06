import React, { useState, FocusEvent, useRef } from 'react';
import { useMutation } from 'react-query';

import Button from '@c/button';
import Modal from '@c/modal';
import { userResetPassword } from '@lib/api/auth';
import PassWordField from '@c/form/input/password-field';
import Form, { FormRef } from '@c/form';
import { isPassword } from '@lib/utils';
import toast from '@lib/toast';

interface Props {
  visible: boolean;
  onCancel: () => void;
}

export default function ResetPasswordModal({ visible, onCancel }: Props) {
  const [values, setValues] = useState({
    old: '',
    new: '',
  });
  const formRef = useRef<FormRef>(null);
  const [loading, setLoading] = useState(false);
  const mutation = useMutation(userResetPassword, {
    onSuccess: () => {
      window.location.pathname = '/login/password';
    },
    onError: (err: Error) => {
      toast.error(err.message);
      setLoading(false);
    },
  });

  function onResetSubmit() {
    formRef.current?.validateFields().then((isAllValid) => {
      if (values.new && values.old && isAllValid) {
        setLoading(true);
        mutation.mutate(values);
      }
    });
  }

  function onChange(type: 'old' | 'new') {
    return function(e: FocusEvent<HTMLInputElement & HTMLTextAreaElement>) {
      const { value } = e.target;
      setValues((values) => ({ ...values, [type]: value }));
    };
  }

  if (!visible) {
    return null;
  }

  return (
    <Modal
      title="重置密码"
      onClose={onCancel}
      // bodyStyle={{
      //   width: '632px',
      //   maxWidth: '100%',
      // }}
      footer={
        (<div className="flex flex-row justify-between items-center">
          <Button
            className="mr-20"
            iconName="close"
            onClick={onCancel}
          >
            取消
          </Button>
          <Button
            modifier='primary'
            loading={loading}
            iconName="check"
            onClick={onResetSubmit}
          >
            确定重置
          </Button>
        </div>)
      }
    >
      <Form className="w-full" ref={formRef}>
        <PassWordField
          label="原密码"
          name="oldPassword"
          onChange={onChange('old')}
          rules={[
            (val: string) => val ? '' : '原密码不能为空',
            (val: string) => val.length < 8 ? '密码长度至少为8位' : '',
            (val: string) => !isPassword(val) ? '密码必须包含数字、字母和符号' : '',
          ]}
        />
        <PassWordField
          label="新密码"
          name="newPassword"
          onChange={onChange('new')}
          rules={[
            (val: string) => val ? '' : '新密码不能为空',
            (val: string) => val.length < 8 ? '密码长度至少为8位' : '',
            (val: string) => !isPassword(val) ? '密码必须包含数字、字母和符号' : '',
          ]}
        />
      </Form>
    </Modal>
  );
}

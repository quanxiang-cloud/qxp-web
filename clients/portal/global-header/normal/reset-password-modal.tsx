import React, { useState, FocusEvent, useRef } from 'react';
import { Modal } from '@QCFE/lego-ui';
import { useMutation } from 'react-query';

import Button from '@c/button';
import { userResetPassword } from '@lib/api/auth';
import PassWordField from '@c/form/input/password-field';
import Form, { FormRef } from '@c/form';
import { isPassword } from '@lib/utils';
import notify from '@lib/notify';

interface Props {
  visible: boolean;
  onCancel: () => void;
}

export default function ResetPasswordModal({ visible, onCancel }: Props) {
  const [values, setValues] = useState({
    old: '',
    new: '',
  });
  const [isForbidden, setIsForbidden] = useState(false);
  const formRef = useRef<FormRef>(null);
  const [loading, setLoading] = useState(false);
  const mutation = useMutation(userResetPassword, {
    onSuccess: () => {
      window.location.pathname = '/login/password';
    },
    onError: (err: Error) => {
      notify.error(err.message);
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
      formRef.current?.isAllValid().then((isAllValid) => {
        setIsForbidden(!isAllValid);
      });
    };
  }

  return (
    <Modal
      title="重置密码"
      onCancel={onCancel}
      visible={visible}
      bodyStyle={{
        width: '632px',
        maxWidth: '100%',
      }}
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
            forbidden={isForbidden || !values.new || !values.old}
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

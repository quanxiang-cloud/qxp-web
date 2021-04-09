import React, { useState, FocusEvent } from 'react';
import { Modal, Message } from '@QCFE/lego-ui';
import { useMutation } from 'react-query';

import Button from '@c/button';
import { userResetPassword } from '@clients/lib/api/auth';
import PassWordField from '@c/form/input/password-field';
import { isPassword } from '@clients/lib/utils';

interface Props {
  visible: boolean;
  onCancel: () => void;
}

export default function ResetPasswordModal({ visible, onCancel }: Props) {
  const [errorMessage, setErrorMessage] = useState({
    old: '',
    new: '',
  });
  const [values, setValues] = useState({
    old: '',
    new: '',
  });
  const [loading, setLoading] = useState(false);
  const mutation = useMutation(userResetPassword, {
    onSuccess: () => {
      window.location.pathname = '/login/password';
    },
    onError: (err: Error) => {
      Message.error(err.message);
    },
  });

  function onOk() {
    if (!errorMessage.old && !errorMessage.new && values.new && values.old) {
      setLoading(true);
      mutation.mutate(values);
    }
  }

  function onValidate(type: 'old' | 'new') {
    const text = type === 'old' ? '原密码' : '新密码';
    return function(e: FocusEvent<HTMLInputElement>) {
      const { value } = e.target;
      if (!value) {
        setErrorMessage((msg) => ({ ...msg, [type]: `${text}不能为空` }));
      } else if (value.length < 8) {
        setErrorMessage((msg) => ({ ...msg, [type]: '密码长度至少为8位' }));
      } else if (!isPassword(value)) {
        setErrorMessage((msg) => ({ ...msg, [type]: '密码必须包含数字、字母和符号' }));
      } else {
        setErrorMessage((msg) => ({ ...msg, [type]: '' }));
      }
    };
  }

  function onChange(type: 'old' | 'new') {
    return function(e: FocusEvent<HTMLInputElement>) {
      const { value } = e.target;
      setValues((values) => ({ ...values, [type]: value }));
    };
  }

  let modifier: 'primary' | 'loading' | 'forbidden' = 'primary';
  if (loading) {
    modifier = 'loading';
  }
  if (errorMessage.new || errorMessage.old || !values.new || !values.old) {
    modifier = 'forbidden';
  }

  return (
    <Modal
      title="重置密码"
      onCancel={onCancel}
      visible={visible}
      footer={
        (<div className="flex flex-row justify-between items-center">
          <Button
            className="bg-white hover:bg-gray-100 transition cursor-pointer mr-20
            mb-0 text-gray-600 ml-2"
            iconName="close"
            onClick={onCancel}
          >
           取消
          </Button>
          <Button
            modifier={modifier}
            className="bg-gray-700 hover:bg-gray-900 transition cursor-pointer mb-0 text-white ml-2"
            iconName="check"
            onClick={onOk}
          >
           确定重置
          </Button>
        </div>)
      }
    >
      <form className="w-full">
        <PassWordField
          label="原密码"
          name="oldPassword"
          onBlur={onValidate('old')}
          onChange={onChange('old')}
          errorMessage={errorMessage.old}
        />
        <PassWordField
          label="新密码"
          name="newPassword"
          onBlur={onValidate('new')}
          errorMessage={errorMessage.new}
          onChange={onChange('new')}
        />
      </form>
    </Modal>
  );
}

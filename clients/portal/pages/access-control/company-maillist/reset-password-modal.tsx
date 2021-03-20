import React, { useState } from 'react';
import { Modal, Form } from '@QCFE/lego-ui';

import { Button } from '@portal/components/button';

const { TextField, CheckboxGroupField } = Form;

export type CheckedWay = {
  sendPhone: -1 | 1;
  sendEmail: -1 | 1;
};

interface ResetPasswordModalProps {
  visible: boolean;
  closeModal(): void;
  okModal: (val: CheckedWay) => void;
}

export const ResetPasswordModal = (props: ResetPasswordModalProps) => {
  const { visible, closeModal, okModal } = props;
  const [form, setForm] = useState<any>(null);

  const handleReset = () => {
    const bol = form.validateForm();
    if (!bol) {
      return;
    }
    const values: { way: string[] } = form.getFieldsValue();
    const { way } = values;
    const checkedWay: CheckedWay = {
      sendEmail: -1,
      sendPhone: -1,
    };
    if (way.length > 0) {
      way.includes('email') && (checkedWay.sendEmail = 1);
      way.includes('phone') && (checkedWay.sendPhone = 1);
    }
    console.log(checkedWay);
    okModal(checkedWay);
  };

  return (
    <Modal
      title="发送随机密码"
      visible={visible}
      className="static-modal"
      onCancel={closeModal}
      footer={
        <div className="flex items-center">
          <Button
            icon={
              <img
                className="w-1-dot-2 h-1-dot-2 px-dot-4"
                src="./dist/images/icon_error.svg"
                alt="icon_error"
              />
            }
            onClick={closeModal}
          >
            取消
          </Button>
          <div className="px-2"></div>
          <Button
            className="bg-black"
            textClassName="text-white"
            icon={
              <img
                className="w-1-dot-2 h-1-dot-2 px-dot-4"
                src="./dist/images/icon_true.svg"
                alt="icon_true"
              />
            }
            onClick={handleReset}
          >
            发送密码
          </Button>
        </div>
      }
    >
      <Form layout="vertical" ref={(n: any) => setForm(n)}>
        {/* <TextField name="account-1" label="重置密码" placeholder="请输入 QingCloud 账号" /> */}
        <CheckboxGroupField
          name="way"
          label="向员工发送密码"
          options={[
            {
              label: '通过邮箱',
              value: 'email',
            },
            {
              label: '通过短信',
              value: 'phone',
            },
          ]}
        />
      </Form>
    </Modal>
  );
};

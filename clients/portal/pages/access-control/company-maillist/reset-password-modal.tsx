import React, { useState } from 'react';
import { Modal, Form, Message } from '@QCFE/lego-ui';

import { Button } from '@portal/components/button';
import SvgIcon from '@portal/components/icon';

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
    if (way.length === 0) {
      Message.error('请选择发送方式');
      return;
    }
    const checkedWay: CheckedWay = {
      sendEmail: -1,
      sendPhone: -1,
    };
    if (way.length > 0) {
      way.includes('email') && (checkedWay.sendEmail = 1);
      way.includes('phone') && (checkedWay.sendPhone = 1);
    }
    okModal(checkedWay);
  };

  return (
    <Modal
      title="重置密码 "
      visible={visible}
      className="static-modal"
      onCancel={closeModal}
      footer={
        <div className="flex items-center">
          <Button
            icon={<SvgIcon name="close" size={20} className="mr-8" />}
            onClick={closeModal}
          >
            取消
          </Button>
          <div className="w-20"></div>
          <Button
            className="bg-black-900"
            textClassName="text-white"
            icon={<SvgIcon name="check" type="light" size={20} className="mr-8" />}
            onClick={handleReset}
          >
            发送密码
          </Button>
        </div>
      }
    >
      <div className="w-full flex flex-col">
        <div className="w-full box-border-radius px-18 py-12 mb-20 bg-blue-100 flex items-center">
          <SvgIcon name="info" size={24} color="#375FF3" className="mr-10" />
          <span className="text-blue-600">系统将自动生成一个随机密码发送给员工。</span>
        </div>
        <Form layout="vertical" ref={(n: any) => setForm(n)}>
          {/* <TextField name="account-1" label="重置密码" placeholder="请输入 QingCloud 账号" /> */}
          <CheckboxGroupField
            name="way"
            label="选择密码发送方式"
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
      </div>
    </Modal>
  );
};

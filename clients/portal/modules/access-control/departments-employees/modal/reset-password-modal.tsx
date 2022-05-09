import React from 'react';
import { useMutation } from 'react-query';
import { Form } from 'antd';

import Icon from '@c/icon';
import toast from '@lib/toast';
import Modal from '@c/modal';
import RadioGroup from '@c/radio/group';
import Radio from '@c/radio';

import { resetUserPWD } from '../api';
import { SEND_MAP } from './edit-employees-modal';

export type SendMessage = {
  userID: string;
  sendChannel: number;
  sendTo: string;
}
interface Props {
  selectedUsers: Employee[];
  closeModal(): void;
}

export const sendMsgOption = [
  {
    label: '通过邮箱',
    value: 1,
  },
  {
    label: '通过短信',
    value: 2,
  },
];

export default function ResetPasswordModal({
  selectedUsers,
  closeModal,
}: Props): JSX.Element {
  const [form] = Form.useForm();

  const resetMutation = useMutation(resetUserPWD, {
    onSuccess: () => {
      toast.success('操作成功！');
      closeModal();
    },
    onError: () => {
      toast.error('操作失败！');
      closeModal();
    },
  });

  function handleSubmit(): void {
    form.submit();
  }

  function handleFinish(values: { sendPasswordBy: number }): void {
    const { sendPasswordBy } = values;
    const userIds: string[] = [];
    const sendMessage: SendMessage[] = selectedUsers.map((user) => {
      userIds.push(user.id);
      return {
        userID: user.id,
        sendChannel: sendPasswordBy,
        sendTo: user[SEND_MAP[sendPasswordBy]] || '',
      };
    });

    resetMutation.mutate({ userIDs: userIds, sendMessage });
  }

  return (
    <Modal
      title="重置密码"
      className="static-modal"
      onClose={closeModal}
      footerBtns={[
        {
          text: '取消',
          key: 'cancel',
          iconName: 'close',
          onClick: closeModal,
        },
        {
          text: '发送重置密码',
          key: 'confirm',
          iconName: 'check',
          modifier: 'primary',
          onClick: handleSubmit,
        },
      ]}
    >
      <div className="w-full flex flex-col p-20">
        <div className="w-full corner-4-12-12-12 px-18 py-12 mb-20 bg-blue-100 flex items-center">
          <Icon
            name="info"
            size={24}
            type="primary"
            style={{ color: '#375FF3' }}
            className="mr-10"
          />
          <span className="text-blue-600">
            系统将自动生成一个随机密码发送给员工。
          </span>
        </div>
        <Form layout="vertical" form={form} onFinish={handleFinish}>
          <Form.Item
            name="sendPasswordBy"
            label="选择重置密码的发送方式"
            rules={[
              { required: true, message: '请选择重置密码的发送方式' },
            ]}
          >
            <RadioGroup onChange={(value) => value}>
              {sendMsgOption.map((option) => {
                return (
                  <Radio
                    className="mr-8"
                    key={option.value}
                    value={option.value}
                    label={option.label}
                  />
                );
              })}
            </RadioGroup>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}

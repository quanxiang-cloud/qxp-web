import React from 'react';
import { useMutation, useQueryClient } from 'react-query';

import Button from '@c/button';
import Modal from '@c/modal';
import toast from '@lib/toast';

import { updateUserStatus } from '../api';
import { UserStatus } from '../type';

interface Props {
  status: UserStatus;
  user: Employee;
  closeModal(): void;
}

export default function AccountHandleModal(
  { status, user, closeModal }: Props) {
  const queryClient = useQueryClient();

  const handleMutation = useMutation(updateUserStatus, {
    onSuccess: () => {
      toast.success('操作成功');
      closeModal();
      queryClient.invalidateQueries('GET_USER_ADMIN_INFO');
    },
    onError: () => {
      toast.error('操作失败');
      closeModal();
    },
  },
  );

  const titleText: string = handleTitle(status);

  function handleSubmit() {
    handleMutation.mutate({ id: user.id, status: status });
  }

  function handleTitle(status: UserStatus): string {
    let title = '';
    switch (status) {
    case UserStatus.disable:
      title = '禁用';
      break;
    case UserStatus.delete:
      title = '删除';
      break;
    default:
      title = '启用';
      break;
    }
    return title;
  }

  return (
    <Modal
      title={`${titleText}账号`}
      className="static-modal"
      onClose={closeModal}
      footer={
        (<div className="flex items-center">
          <Button
            iconName="close"
            onClick={closeModal}
            className="mr-20"
          >
            取消
          </Button>
          <Button
            iconName="check"
            modifier="primary"
            onClick={handleSubmit}
          >
            {titleText}账号
          </Button>
        </div>)
      }
    >
      {status === UserStatus.delete && (
        <div className="text-14">
          删除账号后，在平台内无法恢复员工
          <span className="mx-4 text-16 text-gray-900 font-semibold">{user?.userName}</span>
          数据，确定要删除该账号吗？
        </div>
      )}
      {status === UserStatus.disable && (
        <div className="text-14">
          禁用账号后，员工
          <span className="mx-4 text-16 text-gray-900 font-semibold">{user?.userName}</span>
          无法登录该平台，确定要禁用该账号吗？
        </div>
      )}
      {status === UserStatus.normal && (
        <div className="text-14">
          启用账号后，员工
          <span className="mx-4 text-16 text-gray-900 font-semibold">{user?.userName}</span>
          可以登录该平台，确定要启用该账号吗？
        </div>
      )}
    </Modal>
  );
}

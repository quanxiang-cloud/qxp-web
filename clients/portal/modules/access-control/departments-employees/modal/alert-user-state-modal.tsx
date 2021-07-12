import React from 'react';
import { useMutation, useQueryClient } from 'react-query';

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
      footerBtns={[
        {
          text: '取消',
          key: 'cancel',
          iconName: 'close',
          onClick: closeModal,
        },
        {
          text: titleText + '账号',
          key: 'confirm',
          iconName: 'check',
          modifier: 'primary',
          onClick: handleSubmit,
        },
      ]}
    >
      <div className="text-14 p-20">
        {status === UserStatus.delete && (
          <span
            className="mx-4 text-16 text-gray-900 font-semibold">
            删除账号后，在平台内无法恢复员工{user?.userName}数据，确定要删除该账号吗？
          </span>

        )}
        {status === UserStatus.disable && (
          <span
            className="mx-4 text-16 text-gray-900 font-semibold">
            禁用账号后，员工{user?.userName}无法登录该平台，确定要禁用该账号吗？
          </span>
        )}
        {status === UserStatus.normal && (
          <span
            className="mx-4 text-16 text-gray-900 font-semibold">
            启用账号后，员工{user?.userName}可以登录该平台，确定要启用该账号吗？
          </span>
        )}
      </div>

    </Modal>
  );
}

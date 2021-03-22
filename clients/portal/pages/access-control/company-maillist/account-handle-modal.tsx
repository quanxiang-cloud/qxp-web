/**
 * 禁用/删除/启用 账号
 */
import React from 'react';
import { Modal } from '@QCFE/lego-ui';

import { Button } from '@portal/components/button';
import { UserStatus } from './person-info';
import { IUserInfo } from '@portal/api/auth';

interface AccountHandleModalProps {
  visible: boolean;
  status: UserStatus;
  initData: IUserInfo;
  closeModal(): void;
  okModal(val: IUserInfo): void;
}

export const AccountHandleModal = (props: AccountHandleModalProps) => {
  const { visible, status, initData, closeModal, okModal } = props;

  const titleText = status !== 1 ? (status === -2 ? '禁用' : '删除') : '启用';

  return (
    <Modal
      title={`${titleText}账号`}
      visible={visible}
      className="static-modal"
      onCancel={closeModal}
      footer={
        <div className="flex items-center">
          <Button
            icon={
              <img
                className="w-2-dot-4 h-2-dot-4 pr-dot-4"
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
                className="w-2-dot-4 h-2-dot-4 pr-dot-4"
                src="./dist/images/icon_true.svg"
                alt="icon_true"
              />
            }
            onClick={() => okModal(initData)}
          >
            {titleText}账号
          </Button>
        </div>
      }
    >
      {status === -1 && (
        <div className="text-1-dot-4">
          删除账号后，在平台内无法恢复员工
          <span className="mx-1 text-1-dot-6 font-semibold">{initData?.userName}</span>
          数据，确定要删除该账号吗？
        </div>
      )}
      {status === -2 && (
        <div className="text-1-dot-4">
          禁用账号后，员工
          <span className="mx-1 text-1-dot-6 font-semibold">{initData?.userName}</span>
          无法登录该平台，确定要禁用该账号吗？
        </div>
      )}
      {status === 1 && (
        <div className="text-1-dot-4">
          启用账号后，员工
          <span className="mx-1 text-1-dot-6 font-semibold">{initData?.userName}</span>
          可以登录该平台，确定要启用该账号吗？
        </div>
      )}
    </Modal>
  );
};

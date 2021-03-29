/**
 * 禁用/删除/启用 账号
 */
import React from 'react';
import { Modal } from '@QCFE/lego-ui';

import { Button } from '@portal/components/button';
import { UserStatus } from '../enum';
import { UserInfo } from '@portal/api/auth';
import SvgIcon from '@portal/components/icon';

interface AccountHandleModalProps {
  visible: boolean;
  status: UserStatus;
  initData: UserInfo;
  closeModal(): void;
  okModal(val: UserInfo): void;
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
            onClick={() => okModal(initData)}
          >
            {titleText}账号
          </Button>
        </div>
      }
    >
      {status === -1 && (
        <div className="text-14">
          删除账号后，在平台内无法恢复员工
          <span className="mx-4 text-16 text-gray-900 font-semibold">{initData?.userName}</span>
          数据，确定要删除该账号吗？
        </div>
      )}
      {status === -2 && (
        <div className="text-14">
          禁用账号后，员工
          <span className="mx-4 text-16 text-gray-900 font-semibold">{initData?.userName}</span>
          无法登录该平台，确定要禁用该账号吗？
        </div>
      )}
      {status === 1 && (
        <div className="text-14">
          启用账号后，员工
          <span className="mx-4 text-16 text-gray-900 font-semibold">{initData?.userName}</span>
          可以登录该平台，确定要启用该账号吗？
        </div>
      )}
    </Modal>
  );
};

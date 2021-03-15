import React from 'react'
import { Modal } from '@QCFE/lego-ui'

declare module '@QCFE/lego-ui' {}

import { Button } from '@portal/components/Button'

interface AccountHandleModalProps {
  visible: boolean
  status: 'disabled' | 'delete'
  closeModal(): void
  okModal(): void
}

export const AccountHandleModal = (props: AccountHandleModalProps) => {
  const { visible, status, closeModal, okModal } = props

  const titleText = status === 'delete' ? '删除' : '禁用'

  return (
    <Modal
      title={`${titleText}账号`}
      visible={visible}
      width={632}
      onOk={closeModal}
      onCancel={okModal}
      footer={
        <div className="flex items-center">
          <Button
            icon={
              <img
                className="w-1-dot-2 h-1-dot-2 pr-dot-4"
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
                className="w-1-dot-2 h-1-dot-2 pr-dot-4"
                src="./dist/images/icon_true.svg"
                alt="icon_true"
              />
            }
            onClick={okModal}
          >
            {titleText}账号
          </Button>
        </div>
      }
    >
      {status === 'delete' ? (
        <div className="text-dot-7">
          删除账号后，在平台内无法恢复员工
          <span className="mx-1 text-dot-8 font-semibold">郭LILI</span>
          数据，确定要删除该账号吗？
        </div>
      ) : (
        <div className="text-dot-7">
          禁用账号后，员工
          <span className="mx-1 text-dot-8 font-semibold">郭LILI</span>
          无法登录该平台，确定要禁用该账号吗？
        </div>
      )}
    </Modal>
  )
}

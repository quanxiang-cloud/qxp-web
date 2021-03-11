import React from 'react'
import { Modal, Form } from '@QCFE/lego-ui'

import { Button } from '@portal/components/Button'

const { TextField, CheckboxGroupField } = Form

interface ResetPasswordModalProps {
  visible: boolean
  closeModal(): void
  okModal(): void
}

export const ResetPasswordModal = (props: ResetPasswordModalProps) => {
  const { visible, closeModal, okModal } = props

  return (
    <Modal
      title="重置密码"
      visible={visible}
      width={632}
      onCancel={closeModal}
      onOk={okModal}
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
            onClick={okModal}
          >
            确定重置
          </Button>
        </div>
      }
    >
      <Form layout="vertical">
        <TextField name="account-1" label="重置密码" placeholder="请输入 QingCloud 账号" />
        <CheckboxGroupField
          name="country"
          label="向员工发送密码"
          options={[
            {
              label: '通过邮箱',
              value: '1',
            },
            {
              label: '通过短信',
              value: '2',
            },
          ]}
        />
      </Form>
    </Modal>
  )
}

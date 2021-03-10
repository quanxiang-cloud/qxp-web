/**
 * 组件-添加员工
 */
import React from 'react'
import { Modal, Form } from '@QCFE/lego-ui'

import { Button } from '@portal/components/Button'

const { TextField, SelectField, CheckboxGroupField } = Form;

interface StaffModalProps {
  visible: boolean;
  status: 'add' | 'edit';
  closeModal(): void;
  okModal(): void;
}

export const StaffModal = (props: StaffModalProps) => {
  const { visible, closeModal, okModal } = props;

  const titleText = `${status === 'add' ? '添加' : '修改'}`;

  return (
    <Modal
      title={`${titleText}部门`}
      visible={visible}
      width={632}
      onCancel={closeModal}
      // onOk={okModal}
      footer={
        <div className="flex items-center">
          <Button
            icon={<img className="w-1-dot-2 h-1-dot-2 px-dot-4" src="./dist/images/icon_error.svg" alt="icon_error" />}
            onClick={closeModal}
          >
            取消
          </Button>
          <div className="px-2"></div>
          <Button
            className="bg-black"
            textClassName="text-white"
            icon={<img className="w-1-dot-2 h-1-dot-2 px-dot-4" src="./dist/images/icon_true.svg" alt="icon_true" />}
            onClick={okModal}
          >
            确定{titleText}
          </Button>
        </div>
      }
    >
      <Form layout='vertical'>
        <TextField
          name="account-1"
          label="员工姓名"
          placeholder="请输入 QingCloud 账号"
        />
        <TextField
          name="account-2"
          label="手机号码"
          placeholder="请输入 QingCloud 账号"
          help="企业成员的真实手机号（手机号/邮箱，两者中至少必填一项）。"
        />
        <TextField
          name="email"
          label="邮箱"
          placeholder="例如：name@company.com"
          help="企业成员的真实邮箱，设置后可以通过邮箱接收到全象云平台发送的各类消息提醒（手机号/邮箱，两者中至少必填一项）。"
        />
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
              }
            ]}
          />
        <SelectField
          name="region-select"
          label="部门"
          placeholder="请选择区域"
          style={{width: '100%'}}
          options={[
            { value: 'pek3', label: '北京 3 区' },
            { value: 'gd1', label: '广东 1 区' },
            { value: 'gd2', label: '广东 2 区' },
            { value: 'sh1', label: '上海 1 区' },
          ]}
        />
        <SelectField
          name="region-select"
          multi
          label="角色"
          placeholder="请选择区域"
          defaultValue={['0']}
          options={[
            { value: '0', label: '普通用户' },
            { value: '1', label: '一级用户' },
            { value: '2', label: '二级用户' },
          ]}
        />
      </Form>
    </Modal>
  )
}

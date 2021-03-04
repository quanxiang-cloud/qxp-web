import React, { useState } from 'react'
import { Modal, Form } from '@QCFE/lego-ui'

import { Button } from '@portal/components/Button';

const { TextField, SelectField, ButtonField } = Form;


export const DepartmentModal = () => {
  const [ visible, changeVisible ] = useState<boolean>(true);
  return (
    <Modal
      title="添加部门"
      // visible={visible}
      // onOk={this.hideModal}
      // onCancel={this.hideModal}
      footer={
        <div className="flex items-center">
          <Button
            icon={<img className="w-1-dot-2 h-1-dot-2 p-x-0-dot-4" src="./dist/images/icon_error.svg" alt="icon_error" />}
          >
            取消
          </Button>
          <div className="px-2"></div>
          <Button
            className="bg-black"
            textClassName="text-white"
            icon={<img className="w-1-dot-2 h-1-dot-2 p-x-0-dot-4" src="./dist/images/icon_true.svg" alt="icon_true" />}
          >
            确定添加
          </Button>
        </div>
      }
    >
      <Form layout='vertical'>
        <TextField
          name="account-1"
          label="部门名称"
          placeholder="请输入 QingCloud 账号"
          help="不超过 30 个字符，部门名称不可重复。"
        />
        <SelectField
          name="region-select"
          label="部门主管"
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
          label="所属部门"
          placeholder="请选择区域"
          options={[
            { value: 'pek3', label: '北京 3 区' },
            { value: 'gd1', label: '广东 1 区' },
            { value: 'gd2', label: '广东 2 区' },
            { value: 'sh1', label: '上海 1 区' },
          ]}
        />
      </Form>
    </Modal>
  )
}
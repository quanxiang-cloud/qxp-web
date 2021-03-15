import React, { useState } from 'react';
import { Modal, Form } from '@QCFE/lego-ui';

import { Button } from '@portal/components/Button';

const { TextField, SelectField, ButtonField } = Form;

interface DepartmentModalProps {
  visible: boolean;
  status: 'add' | 'edit';
  nodeId: string;
  closeModal(): void;
  okModal: (val: any, nodeIndex: string) => void;
}

export const DepartmentModal = ({
  visible,
  status,
  nodeId,
  closeModal,
  okModal,
}: DepartmentModalProps) => {
  const titleText = `${status === 'add' ? '添加' : '修改'}`;

  const [form, setForm] = useState<any>(null);

  const okModalHandle = () => {
    const bol = form.validateForm();
    if (!bol) {
      return;
    }
    const values = form.getFieldsValue();
    okModal(values, nodeId);
  };

  return (
    <Modal
      title={`${titleText}部门`}
      visible={visible}
      onCancel={closeModal}
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
            onClick={okModalHandle}
          >
            确定{titleText}
          </Button>
        </div>
      }
    >
      <Form layout="vertical" ref={(n: any) => setForm(n)}>
        <TextField
          name="department-name"
          label="部门名称"
          placeholder="请输入 QingCloud 账号"
          help="不超过 30 个字符，部门名称不可重复。"
          schemas={[
            {
              help: '请输入 QingCloud 账号',
              rule: { required: true },
            },
          ]}
        />
        <SelectField
          name="department-manager"
          label="部门主管"
          placeholder="请选择区域"
          style={{ width: '100%' }}
          options={[
            { value: 'pek3', label: '北京 3 区' },
            { value: 'gd1', label: '广东 1 区' },
            { value: 'gd2', label: '广东 2 区' },
            { value: 'sh1', label: '上海 1 区' },
          ]}
        />
        <SelectField
          name="department"
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
  );
};

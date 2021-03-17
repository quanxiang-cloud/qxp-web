import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Modal, Form, Loading } from '@QCFE/lego-ui';

import { Button } from '@portal/components/Button';
import SelectTree from '@portal/components/select-tree';
import { getERPTree } from './api';

const { TextField, SelectField, ButtonField } = Form;
const SelectTreeField = Form.getFormField(SelectTree);

interface DepartmentModalProps {
  status: 'add' | 'edit';
  nodeId: string;
  closeModal(): void;
  okModal: (val: any, nodeIndex: string) => void;
}

export const DepartmentModal = ({
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
    console.log('values: ', values);
    // okModal(values, nodeId);
  };

  const valueRenderer = (option: any) => (
    <span className="option-with-icon" style={{ display: 'flex', alignItems: 'center' }}>
      123
      <span style={{ color: '#00aa72' }}>{option.label}</span>
    </span>
  );

  const modalClick = (event: React.MouseEvent): void => {
    console.log(event);
    event.preventDefault();
    return;
  };

  const { data, isLoading } = useQuery('getERPTree', getERPTree, {
    refetchOnWindowFocus: false,
  });

  const treeData = data ? [data] : [];

  return (
    <Modal
      visible
      title={`${titleText}部门`}
      width={632}
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
          label="部门名称1"
          placeholder="请输入 QingCloud 账号"
          help="不超过 30 个字符，部门名称不可重复。"
          schemas={[
            {
              help: '请输入 QingCloud 账号',
              rule: { required: true },
            },
          ]}
        />
        {isLoading ? (<Loading />) : (
          <SelectTreeField
            name="pid"
            label="选择部门"
            placeholder="请选择部门"
            defaultSelect={nodeId}
            treeData={treeData} />
        )}
      </Form>
    </Modal>
  );
};

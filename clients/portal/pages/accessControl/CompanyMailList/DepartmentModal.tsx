import React, { createRef, useRef, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Modal, Form, Loading, Icon } from '@QCFE/lego-ui';

import { Button } from '@portal/components/Button';
import SelectTree from '@portal/components/select-tree';
import { getERPTree, createDepartment, editDepartment } from './api';

const { TextField } = Form;
const SelectTreeField = Form.getFormField(SelectTree);

interface DepartmentModalProps {
  status: 'add' | 'edit';
  nodeId: string;
  closeModal(): void;
}

export default function DepartmentModal({ status, nodeId, closeModal }: DepartmentModalProps) {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery('getERPTree', getERPTree, {
    refetchOnWindowFocus: false,
  });
  const titleText = `${status === 'add' ? '添加' : '修改'}`;
  const formRef = createRef<Form>();

  const okModalHandle = () => {
    if (!formRef.current?.validateForm()) {
      return;
    }

    createDepartment(formRef.current?.getFieldsValue())
      .then(() => {
        queryClient.invalidateQueries('getERPTree');

        closeModal();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const treeData = data ? [data] : [];

  return (
    <Modal
      visible
      title={`${titleText}部门`}
      width={632}
      onCancel={closeModal}
      footer={
        <div className="flex items-center">
          <Button icon={<Icon name="close" className="mr-dot-4" />} onClick={closeModal}>
            取消
          </Button>
          <div className="px-2"></div>
          <Button
            className="bg-black"
            textClassName="text-white"
            icon={<Icon name="check" className="mr-dot-4" />}
            onClick={okModalHandle}
          >
            确定{titleText}
          </Button>
        </div>
      }
    >
      <Form layout="vertical" ref={formRef}>
        <TextField
          name="departmentName"
          label="部门名称"
          placeholder="请输入部门名称"
          help="不超过 30 个字符，部门名称不可重复。"
          schemas={[
            {
              help: '请输入部门名称',
              rule: { required: true },
            },
          ]}
        />
        {isLoading ? (
          <Loading />
        ) : (
          <SelectTreeField
            name="pid"
            label="选择部门"
            placeholder="请选择部门"
            defaultSelect={nodeId}
            treeData={treeData}
          />
        )}
      </Form>
    </Modal>
  );
}

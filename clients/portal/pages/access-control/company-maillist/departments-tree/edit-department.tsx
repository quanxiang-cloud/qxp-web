import React, { createRef, useState } from 'react';
import { useQueryClient } from 'react-query';
import { Modal, Form, Icon, Message } from '@QCFE/lego-ui';

import { Button } from '@portal/components/button';
import DepartmentPicker from '@c/department-picker';

import { createDepartment, editDepartment } from '../api';

const { TextField } = Form;

interface DepartmentModalProps {
  department: DeptInfo;
  closeModal(): void;
}

export default function EditDepartment({ department, closeModal }: DepartmentModalProps) {
  const [pid, setPID] = useState('');
  const formRef = createRef<Form>();

  const queryClient = useQueryClient();
  const title = department.id ? '修改部门' : '添加部门';
  const submitBtnText = department.id ? '确认修改' : '确认添加';

  const okModalHandle = () => {
    if (!formRef.current?.validateForm()) {
      return;
    }

    const requestAPI = department.id ? editDepartment : createDepartment;
    const params = formRef.current?.getFieldsValue();

    if (department.id) {
      params.id = department?.id;
    }

    if (!pid) {
      Message.error('请选择父级部门');
      return;
    }

    params.pid = pid;

    requestAPI(params).then(() => {
      queryClient.invalidateQueries('getERPTree');
      closeModal();
      Message.success({ content: '操作成功！' });
    }).catch((error: any) => {
      console.log(error);
    });
  };

  return (
    <Modal
      visible
      appendToBody
      title={title}
      width={632}
      style={{ maxWidth: '632px' }}
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
            {submitBtnText}
          </Button>
        </div>
      }
    >
      <Form layout="vertical" ref={formRef}>
        <TextField
          name="departmentName"
          label="部门名称"
          placeholder="请输入部门名称"
          help="不超过 10 个字符，部门名称不可重复。"
          defaultValue={department.departmentName}
          schemas={[
            {
              help: '请输入部门名称',
              rule: { required: true },
            },
          ]}
        />
        <span>所属部门</span>
        <DepartmentPicker onChange={({ id }) => setPID(id)} />
      </Form>
    </Modal>
  );
}

import React, { createRef, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Modal, Form, Icon, Message } from '@QCFE/lego-ui';

import { Button } from '@portal/components/Button';
import SelectTree from '@portal/components/select-tree';
import { getERPTree, createDepartment, editDepartment } from '../api';

const { TextField } = Form;
const SelectTreeField = Form.getFormField(SelectTree);

interface DepartmentModalProps {
  department: DeptInfo;
  closeModal(): void;
}

export default function EditDepartment({ department, closeModal }: DepartmentModalProps) {
  const title = department.id ? '修改部门' : '添加部门';
  const submitBtnText = department.id ? '确认修改' : '确认添加';

  const [parentNode, setParentNode] = useState<DeptInfo | null>(null);
  const queryClient = useQueryClient();
  const { data } = useQuery('getERPTree', getERPTree);

  const treeData = data ? [data] : [];
  const formRef = createRef<Form>();

  const okModalHandle = () => {
    if (!formRef.current?.validateForm()) {
      return;
    }

    const requestAPI = department.id ? editDepartment : createDepartment;
    const params = formRef.current?.getFieldsValue();

    if (department.id) {
      params.id = department?.id;
    }

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
          help="不超过 30 个字符，部门名称不可重复。"
          defaultValue={department.departmentName}
          schemas={[
            {
              help: '请输入部门名称',
              rule: { required: true },
            },
          ]}
        />
        <SelectTreeField
          name="pid"
          label="选择部门"
          placeholder="请选择部门"
          defaultSelect={parentNode}
          treeData={treeData}
        />
      </Form>
    </Modal>
  );
}

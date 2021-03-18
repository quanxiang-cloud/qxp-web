import React, { createRef, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Modal, Form, Icon, Message } from '@QCFE/lego-ui';

import { Button } from '@portal/components/Button';
import SelectTree from '@portal/components/select-tree';
import { getERPTree, createDepartment, editDepartment } from './api';

const { TextField } = Form;
const SelectTreeField = Form.getFormField(SelectTree);

interface DepartmentModalProps {
  department: DeptInfo | null;
  closeModal(): void;
  deptModalType: 'add' | 'edit';
}

function findTreeNode(originalTreeData: DeptTree, targetId: string, saveTargetNode: React.Dispatch<null | DeptInfo>) {
  let stop: boolean = false;
  function findFun(treeData: DeptTree) {
    if (stop) {
      return
    }

    if (treeData.id === targetId) {
      saveTargetNode(treeData)
      stop = true;
      return
    }

    if (treeData.child) {
      treeData.child.forEach((treeDataItem) => {
        findFun(treeDataItem)
      })
    }
  }

  findFun(originalTreeData)
}

export default function DepartmentModal({ department, closeModal, deptModalType }: DepartmentModalProps) {
  const isEdit = deptModalType === 'edit';
  const [parentNode, setParentNode] = useState<DeptInfo | null>(null)
  const queryClient = useQueryClient();
  const { data } = useQuery('getERPTree', () => getERPTree().then((_treeData: any) => {
    if (isEdit) {
      if (department?.pid) {
        findTreeNode(_treeData, department.pid, setParentNode);
      }
    } else {
      setParentNode(department);
    }
    return _treeData
  }), {
    refetchOnWindowFocus: false,
  });

  const treeData = data ? [data] : [];
  const titleText = isEdit ? '修改' : '添加';
  const formRef = createRef<Form>();

  const okModalHandle = () => {
    if (!formRef.current?.validateForm()) {
      return;
    }

    const requestAPI = isEdit ? editDepartment : createDepartment;
    const params = formRef.current?.getFieldsValue();

    if (isEdit) {
      params.id = department?.id;
    }

    requestAPI(params)
      .then(() => {
        queryClient.invalidateQueries('getERPTree');
        closeModal();
        Message.success({
          content: '操作成功！',
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
          defaultValue={isEdit && department?.departmentName}
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

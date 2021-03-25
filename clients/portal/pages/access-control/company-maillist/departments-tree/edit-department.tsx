import React, { createRef } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Modal, Form, Icon, Message } from '@QCFE/lego-ui';

import { Button } from '@portal/components/button';
import DepartmentPicker from '@portal/components/tree-picker';
import { Loading } from '@portal/components/loading2';

import { createDepartment, editDepartment, getERPTree } from '../api';
import { departmentToTreeNode } from '@assets/lib/utils';

const { TextField } = Form;

interface DepartmentModalProps {
  department: DeptInfo;
  closeModal(): void;
}

export default function EditDepartment({ department, closeModal }: DepartmentModalProps) {
  const formRef = createRef<Form>();
  const queryClient = useQueryClient();

  const title = department.id ? '修改部门' : '添加部门';
  const submitBtnText = department.id ? '确认修改' : '确认添加';
  let { data: depData, isLoading } = useQuery('getERPTree', getERPTree, {
    refetchOnWindowFocus: false,
  });


  if (isLoading || !depData) {
    return <Loading desc="加载中..." />;
  }

  if (depData && (depData.id === department.id)) {
    depData = undefined;
  }

  const removeSelf = (dep: IDepartment | undefined): IDepartment | undefined => {
    if (!dep || dep.id === department.id) {
      return;
    }
    return {
      ...dep,
      child: dep.child?.map((dp) => removeSelf(dp)).filter(Boolean) as IDepartment[],
    };
  };

  depData = removeSelf(depData);

  const okModalHandle = () => {
    if (!formRef.current?.validateForm()) {
      return;
    }

    const requestAPI = department.id ? editDepartment : createDepartment;
    const params = formRef.current?.getFieldsValue();

    if (department.id) {
      params.id = department?.id;
    }

    if (!params.pid && !department.id) {
      Message.error('请选择父级部门');
      return;
    }

    requestAPI(params).then(() => {
      closeModal();
      Message.success({ content: '操作成功！' });
      queryClient.invalidateQueries('getERPTree');
    }).catch((error: any) => {
      console.log(error);
    });
  };

  return (
    <Modal
      visible
      appendToBody
      title={title}
      // width={632}
      // style={{ maxWidth: '632px' }}
      className="static-modal"
      onCancel={closeModal}
      footer={
        <div className="flex items-center">
          <Button icon={<Icon name="close" className="mr-4" />} onClick={closeModal}>
            取消
          </Button>
          <div className="px-2"></div>
          <Button
            className="bg-black-900"
            textClassName="text-white"
            icon={<Icon name="check" className="mr-4" />}
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
        {depData && (
          <DepartmentPicker
            label="所属部门"
            treeData={departmentToTreeNode(depData as IDepartment)}
            labelKey="departmentName"
            name="pid"
          />
        )}
      </Form>
    </Modal>
  );
}

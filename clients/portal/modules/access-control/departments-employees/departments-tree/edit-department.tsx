import React from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Form, Input } from 'antd';

import DepartmentPicker from '@c/form/input/tree-picker-field';
import Modal from '@c/modal';
import Loading from '@c/loading';
import toast from '@lib/toast';
import { departmentToTreeNode } from '@lib/utils';

import { getERPTree, createDepartment, editDepartment } from '../api';

const HELP_TEXT_NORMAL = '部门名称不超过 30 个字符';
const HELP_TEXT_REG_ERROR = '只能包含汉字、英文、横线("-")以及下划线("_")，请修改！';

interface Props {
  department: DeptInfo;
  closeModal(): void;
}

function EditDepartment({ department, closeModal }: Props): JSX.Element {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const title = department.id ? '修改部门' : '添加部门';
  const submitBtnText = department.id ? '确认修改' : '确认添加';

  let { data: depData, isLoading } = useQuery('getERPTree', getERPTree, {
    refetchOnWindowFocus: false,
  });

  if (depData && (depData.id === department.id)) {
    depData = undefined;
  }

  const removeSelf = (dep: Department | undefined): Department | undefined => {
    if (!dep || dep.id === department.id) {
      return;
    }
    return {
      ...dep,
      child: dep.child?.map((dp) => removeSelf(dp)).filter(Boolean) as Department[],
    };
  };

  depData = removeSelf(depData);

  function handleSubmit(): void {
    form.submit();
  }

  function handleFinish(values: any): void {
    const requestAPI = department.id ? editDepartment : createDepartment;
    const params = { ...values };
    if (department.id) {
      params.id = department?.id;
    }

    if (!params.pid && !department.id) {
      toast.error('请选择父级部门');
      return;
    }

    requestAPI(params).then(() => {
      toast.success('操作成功！');
      queryClient.invalidateQueries('GET_ERP_TREE');
      closeModal();
    }).catch((error) => {
      toast.error('发生未知错误:' + error);
    });
  }

  if (isLoading || !depData) {
    return <Loading desc="加载中..." />;
  }

  return (
    <Modal
      title={title}
      className="static-modal"
      onClose={closeModal}
      footerBtns={[
        {
          text: '取消',
          key: 'cancel',
          iconName: 'close',
          onClick: closeModal,
        },
        {
          text: submitBtnText,
          key: 'confirm',
          iconName: 'check',
          modifier: 'primary',
          onClick: handleSubmit,
        },
      ]}
    >
      <Form
        className="p-20"
        layout="vertical"
        form={form}
        onFinish={handleFinish}
        initialValues={{
          departmentName: department.departmentName,
          pid: department.pid,
        }}
      >
        <Form.Item
          name="departmentName"
          label="部门名称"
          extra={HELP_TEXT_NORMAL}
          rules={[
            { required: true, message: '请输入部门名称' },
            { type: 'string', max: 30, message: HELP_TEXT_NORMAL },
            { validator: (_, value) => {
              const departmentName = value && value.trim();
              const reg = /^[\u4e00-\u9fa5A-Za-z0-9-_]+$/g;
              if (departmentName && !reg.test(departmentName)) {
                return Promise.reject(new Error(HELP_TEXT_REG_ERROR));
              }
              return Promise.resolve();
            } },
          ]}
        >
          <Input maxLength={30} placeholder="请输入部门名称" />
        </Form.Item>
        {
          depData && (
            <Form.Item
              name="pid"
              label="部门"
              rules={[
                { required: true, message: '请选择部门' },
              ]}
            >
              <DepartmentPicker
                treeData={departmentToTreeNode(depData as Department)}
                labelKey="departmentName"
              />
            </Form.Item>
          )
        }
      </Form>
    </Modal>
  );
}

export default EditDepartment;

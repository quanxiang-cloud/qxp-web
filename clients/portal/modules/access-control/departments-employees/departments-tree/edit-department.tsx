import React, { useEffect, useState } from 'react';
import { Form, Input } from 'antd';

import DepartmentPicker from '@c/form/input/tree-picker-field';
import Modal from '@c/modal';
import Loading from '@c/loading';
import toast from '@lib/toast';
import { TreeNode } from '@c/headless-tree/types';

import { createDepartment, editDepartment } from '../api';
import store from '../store';

const HELP_TEXT_NORMAL = '名称不超过 30 个字符';
const HELP_TEXT_REG_ERROR = '只能包含汉字、英文、横线("-")以及下划线("_")，请修改！';

interface Props {
  department: DeptInfo;
  closeModal(): void;
}

function EditDepartment({ department, closeModal }: Props): JSX.Element {
  const [form] = Form.useForm();

  const [depTreeNode, setDepTreeNode] = useState<TreeNode<Department>>();
  const [loading, setLoading] = useState(true);
  const [pid, setPid] = useState(department.pid || '');
  const [actionText, setActionName] = useState('修改');
  const [organize, setOrganize] = useState('部门');

  useEffect(() => {
    if (!store.depTreeNode) return;
    setLoading(false);

    let curDepTreeNode = store.filterSelf(store.depTreeNode, department);
    if (department.attr === 1) {
      curDepTreeNode = store.filterDepartment(store.depTreeNode);
    }

    setDepTreeNode(curDepTreeNode);
  }, [store.depTreeNode]);

  useEffect(() => {
    if (isCreate()) setActionName('添加');

    if (isCompany()) setOrganize('公司');
  }, []);

  function isCompany(): boolean {
    return department.attr === 1;
  }

  function isCreate(): boolean {
    return !department.id;
  }

  function isTopCompany(): boolean {
    return !department.pid && isCompany();
  }

  function handleSubmit(): void {
    form.submit();
  }

  function handleChangeParent(value: string): void {
    if (value === pid) return;

    setPid(value);
    form.validateFields();
  }

  function validateSameName(name: string): Promise<void> {
    const departmentName = name && name.trim();
    const reg = /^[\u4e00-\u9fa5A-Za-z0-9-_]+$/g;
    if (departmentName && !reg.test(departmentName)) {
      return Promise.reject(new Error(HELP_TEXT_REG_ERROR));
    }

    const parentNode = store.depTreeNode && store.findNodeById(store.depTreeNode, pid);
    const invalidDepartmentNames = parentNode?.children
      ?.filter(({ id }) => id !== parentNode.id)
      .map((node) => node.data.name) ?? [];

    if (invalidDepartmentNames.includes(departmentName)) {
      return Promise.reject(new Error(`同一${organize}下子部门名称不能重复，请修改！`));
    }
    return Promise.resolve();
  }

  function handleFinish(values: any): void {
    const requestAPI = department.id ? editDepartment : createDepartment;
    const params = { ...values };
    if (department.id) {
      params.id = department.id;
    }
    params.attr = department.attr;

    if (!params.pid && !isTopCompany()) {
      toast.error(`请选择父级${organize}`);
      return;
    }

    requestAPI(params).then(() => {
      toast.success('操作成功！');
      store.fetchTree();
      closeModal();
    }).catch((error) => {
      toast.error('发生未知错误:' + error);
    });
  }

  return (
    <Modal
      title={`${actionText}${organize}`}
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
          text: `确认${actionText}`,
          key: 'confirm',
          iconName: 'check',
          modifier: 'primary',
          onClick: handleSubmit,
        },
      ]}
    >
      {loading ? (
        <Loading desc="加载中..." />
      ) : (
        <Form
          className="p-20"
          layout="vertical"
          form={form}
          onFinish={handleFinish}
          initialValues={{
            name: department.name,
            pid: department.pid,
          }}
        >
          <Form.Item
            name="name"
            label={`${organize}名称`}
            extra={`${organize}${HELP_TEXT_NORMAL}`}
            rules={[
              { required: true, message: `请输入${organize}名称` },
              { type: 'string', max: 30, message: `${organize}${HELP_TEXT_NORMAL}` },
              { validator: (_, value) => validateSameName(value) },
            ]}
          >
            <Input maxLength={30} placeholder={`请输入${organize}名称`} />
          </Form.Item>
          {
            !isTopCompany() && depTreeNode && (
              <Form.Item
                name="pid"
                label="所属部门"
                rules={[
                  { required: true, message: '请选择部门' },
                ]}
              >
                <DepartmentPicker
                  treeData={depTreeNode}
                  labelKey="name"
                  onChange={handleChangeParent}
                />
              </Form.Item>
            )
          }
        </Form>
      )}
    </Modal>
  );
}

export default EditDepartment;

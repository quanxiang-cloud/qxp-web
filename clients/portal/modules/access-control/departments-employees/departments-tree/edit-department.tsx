import React, { createRef, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Form } from '@QCFE/lego-ui';

import Button from '@c/button';
import Modal from '@c/modal';
import DepartmentPicker from '@c/form/input/tree-picker-field';
import Loading from '@c/loading';
import toast from '@lib/toast';
import { departmentToTreeNode } from '@lib/utils';

import { createDepartment, editDepartment, getERPTree } from '../api';

const { TextField } = Form;
// const string for form input help text
const HELP_TEXT_NORMAL = '名称不超过 30 个字符，请修改！';
// const HELP_TEXT_DUPLICATED = '名称已存在，请修改！';
const HELP_TEXT_REG_ERROR = '只能包含汉字、英文、横线("-")以及下划线("_")，请修改！';

interface Props {
  department: DeptInfo;
  closeModal(): void;
}

export default function EditDepartment({ department, closeModal }: Props) {
  const [depNameStatus, setDepNameState] = useState('');
  const [depNameHelpText, setDepNameHelpText] = useState(HELP_TEXT_NORMAL);

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

  // validate departmentName after input blur
  const handleDepBlur = (value?: string) => {
    if (!value) {
      return;
    }
    const departmentName = value?.trim();
    const reg = /^[\u4e00-\u9fa5A-Za-z0-9-\_]+$/g;
    if (!reg.test(departmentName)) {
      setDepNameHelpText(HELP_TEXT_REG_ERROR);
      setDepNameState('error');
    } else {
      setDepNameHelpText(HELP_TEXT_NORMAL);
      setDepNameState('');
    }
  };

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
  };

  return (
    <Modal
      title={title}
      className="static-modal"
      onClose={closeModal}
      footer={
        (<div className="flex items-center">
          <Button
            iconName="close"
            className="mr-20"
            onClick={closeModal}
          >
            取消
          </Button>
          <Button
            modifier="primary"
            iconName="check"
            onClick={okModalHandle}
          >
            {submitBtnText}
          </Button>
        </div>)
      }
    >
      <Form layout="vertical" ref={formRef}>
        <TextField
          name="departmentName"
          label="部门名称"
          placeholder="请输入部门名称"
          help={HELP_TEXT_NORMAL}
          validateHelp={depNameHelpText}
          validateStatus={depNameStatus}
          // @ts-ignore
          maxLength={30}
          validateOnBlur
          defaultValue={department.departmentName}
          onBlur={handleDepBlur}
          schemas={[
            {
              rule: { required: true },
              help: HELP_TEXT_NORMAL,
              status: 'error',
            },
          ]}
        />
        {depData && (
          <DepartmentPicker
            label="所属部门"
            treeData={departmentToTreeNode(depData as Department)}
            labelKey="departmentName"
            name="pid"
            defaultValue={department.pid}
            required
            help="请选择部门"
          />
        )}
      </Form>
    </Modal>
  );
}

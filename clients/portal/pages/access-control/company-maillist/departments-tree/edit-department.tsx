import React, { createRef, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Modal, Form, Icon, Message } from '@QCFE/lego-ui';

import { Button } from '@c/button';
import DepartmentPicker from '@c/tree-picker';
import { Loading } from '@c/loading2';

import { createDepartment, editDepartment, getERPTree } from '@net/corporate-directory';
import { departmentToTreeNode } from '@lib/utils';

const { TextField } = Form;

// const string for form input help text
const HELP_TEXT_NORMAL = '不超过 30 个字符，部门名称不可重复。';
const HELP_TEXT_OVERLENGTH = '部门名称不能超过30个字符';
const HELP_TEXT_DUPLICATED = '名称已存在，请修改';
interface DepartmentModalProps {
  department: DeptInfo;
  closeModal(): void;
}

export default function EditDepartment({ department, closeModal }: DepartmentModalProps) {
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

  // validate departmentName after input blur
  const handleDepBlur = (value?: string) => {
    if (!value) {
      return;
    }
    const departmentName = value?.trim();
    if (departmentName.length > 30) {
      setDepNameHelpText(HELP_TEXT_OVERLENGTH);
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
      Message.error('请选择父级部门');
      return;
    }

    requestAPI(params).then((submitResponseData: any) => {
      switch (submitResponseData.code) {
      case 0:
        Message.success({ content: '操作成功！' });
        queryClient.invalidateQueries('GET_ERP_TREE');
        closeModal();
        break;
      case 54001003:
        setDepNameHelpText(HELP_TEXT_DUPLICATED);
        setDepNameState('error');
        break;
      default:
        Message.error({ content: '发生未知错误！' });
      }
    }).catch((error: any) => {
      console.log(error);
    });
  };

  return (
    <Modal
      visible
      appendToBody
      title={title}
      className="static-modal"
      onCancel={closeModal}
      footer={
        <div className="flex items-center">
          <Button icon={<Icon name="close" className="mr-4" />} onClick={closeModal}>
            取消
          </Button>
          <div className="w-20"></div>
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
          help={HELP_TEXT_NORMAL}
          validateHelp={depNameHelpText}
          validateStatus={depNameStatus}
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
            treeData={departmentToTreeNode(depData as IDepartment)}
            labelKey="departmentName"
            name="pid"
          />
        )}
      </Form>
    </Modal>
  );
}

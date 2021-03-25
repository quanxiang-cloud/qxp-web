import React, { createRef, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Modal, Form, Icon, Message } from '@QCFE/lego-ui';

import { Button } from '@portal/components/button';
import SelectTree from '@portal/components/select-tree';
import { getERPTree, createDepartment, editDepartment, queryERPName } from './api';

const { TextField } = Form;
const SelectTreeField = Form.getFormField(SelectTree);

interface DepartmentModalProps {
  department: DeptInfo | null;
  closeModal(): void;
  deptModalType: 'add' | 'edit';
}

type DepParams = {
  depID: string;
  depName: string;
};

function findTreeNode(
  originalTreeData: DeptTree,
  targetId: string,
  saveTargetNode: React.Dispatch<null | DeptInfo>,
) {
  let stop = false;
  function findFun(treeData: DeptTree) {
    if (stop) {
      return;
    }

    if (treeData.id === targetId) {
      saveTargetNode(treeData);
      stop = true;
      return;
    }

    if (treeData.child) {
      treeData.child.forEach((treeDataItem) => {
        findFun(treeDataItem);
      });
    }
  }

  findFun(originalTreeData);
}

export default function DepartmentModal({
  department,
  closeModal,
  deptModalType,
}: DepartmentModalProps) {
  const isEdit = deptModalType === 'edit';
  const [parentNode, setParentNode] = useState<DeptInfo | null>(null);
  const queryClient = useQueryClient();
  const { data } = useQuery(
    'getERPTree',
    () =>
      getERPTree().then((_treeData: any) => {
        if (isEdit) {
          if (department?.pid) {
            findTreeNode(_treeData, department.pid, setParentNode);
          }
        } else {
          setParentNode(department);
        }
        return _treeData;
      }),
    {
      refetchOnWindowFocus: false,
    },
  );

  const treeData = data ? [data] : [];
  const titleText = isEdit ? '修改' : '添加';
  const formRef = createRef<Form>();

  const okModalHandle = async () => {
    if (!formRef.current?.validateForm()) {
      return;
    }
    const params = formRef.current?.getFieldsValue();

    const bol = await validateDepName(params.pid, params.departmentName);
    if (!bol) {
      Message.error('部门名称重复，请重新输入');
      return;
    }

    if (isEdit) {
      params.id = department?.id;
    }

    const requestAPI = isEdit ? editDepartment : createDepartment;

    requestAPI(params)
      .then(() => {
        queryClient.invalidateQueries('getERPTree');
        closeModal();
        Message.success({
          content: '操作成功！',
        });
      })
      .catch((error) => {
        Message.error('操作失败！');
      });
  };

  const validateDepName = async (id: string, value: string) => {
    const params: DepParams = {
      depID: id,
      depName: value,
    };
    const res = await queryERPName(params);
    if (res && res.code === 0) {
      const { data } = res;
      if (data && data.isExist === 1) {
        return false;
      } else {
        return true;
      }
    } else {
      Message.error(res?.msg || '返回结果失败！');
      return false;
    }
  };

  return (
    <Modal
      visible
      title={`${titleText}部门`}
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
            icon={<Icon name="check" type="light" className="mr-4" />}
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
          validateOnBlur
          defaultValue={(isEdit && department?.departmentName) || ''}
          maxLength={30}
          schemas={[
            {
              rule: { required: true },
              help: '请输入部门名称',
            },
          ]}
        />
        <SelectTreeField
          name="pid"
          label="所属部门"
          placeholder="请选择所属部门"
          defaultSelect={parentNode}
          treeData={treeData}
          schemas={[
            {
              rule: { required: true },
              help: '请选择所属部门',
            },
          ]}
        />
      </Form>
    </Modal>
  );
}

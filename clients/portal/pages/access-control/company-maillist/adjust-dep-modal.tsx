/**
 * Adjust department Modal
 */
import React, { createRef } from 'react';
import { useQuery } from 'react-query';
import { Modal, Icon, Form, Loading, Message } from '@QCFE/lego-ui';

import { Button } from '@portal/components/button';
import SelectTree from '@portal/components/select-tree';
import { BatchDepParams } from './person-info';
import { IUserInfo } from '@portal/api/auth';
import { getERPTree } from './api';

const SelectTreeField = Form.getFormField(SelectTree);

interface IAdjustDepModalProps {
  userList: IUserInfo[];
  visible: boolean;
  closeModal(): void;
  okModal: (val: BatchDepParams) => void;
}

export const AdjustDepModal = (props: IAdjustDepModalProps) => {
  const { visible, userList, closeModal, okModal } = props;
  const formRef = createRef<Form>();

  const { data: depData, isLoading } = useQuery('getERPTree', getERPTree, {
    refetchOnWindowFocus: false,
  });

  const treeData = depData ? [depData] : [];

  const okModalHandle = () => {
    if (!formRef.current?.validateForm()) {
      return;
    }

    const bol = userList.find((user) => user.isDEPLeader === 1);
    if (bol) {
      Message.error('当前已选择员工列表中存在部门主管，不能参与调整部门！');
      return;
    }
    const params: BatchDepParams = {
      usersID: [],
      oldDepID: '',
      newDepID: '',
    };
    const values = formRef.current?.getFieldsValue();
    if (values?.pid) {
      params.newDepID = values.pid;
    }
    params.oldDepID = (userList && userList[0] && userList[0].dep?.id) || '';
    userList.forEach((user) => params.usersID.push(user.id));
    okModal(params);
  };

  return (
    <Modal
      visible={visible}
      title="调整部门"
      className="static-modal"
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
            icon={<Icon name="check" type="light" className="mr-dot-4" />}
            onClick={okModalHandle}
          >
            确定
          </Button>
        </div>
      }
    >
      <div>
        <div>
          <p className="text-gray-600 text-1-dot-4">已选择员工</p>
          <ul className="flex items-center">
            {userList.map((user) => {
              return (
                <li key={user.id} className="rounded-tl-dot-2 rounded-br-dot-2 px-dot-4 bg-DEE9FF">
                  <span className="text-375FF3 text-1-dot-4">{user.userName}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="mt-4">
          <p className="text-gray-600 text-1-dot-4">选择要调整的部门</p>
          <Form layout="vertical" ref={formRef}>
            {isLoading ? (
              <Loading />
            ) : (
              <SelectTreeField
                name="pid"
                // label="选择部门"
                placeholder="请选择部门"
                // defaultSelect={department?.id || ''}
                treeData={treeData}
              />
            )}
          </Form>
        </div>
      </div>
    </Modal>
  );
};

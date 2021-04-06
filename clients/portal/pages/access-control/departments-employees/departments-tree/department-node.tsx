import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { Modal, Message } from '@QCFE/lego-ui';
import { useQueryClient } from 'react-query';

import MoreMenu, { MenuItem } from '@c/more-menu';
import Authorized from '@cc/authorized';
import SvgIcon from '@c/icon';
import { deleteDEP } from '@net/corporate-directory';
import { NodeRenderProps } from '@c/headless-tree/types';

import EditDepartment from './edit-department';

const MENUS: MenuItem<string>[] = [
  {
    key: 'add',
    label: (
      <div className="flex items-center">
        <SvgIcon name="device_hub" size={16} className="mr-8" />
        <span className="font-normal">添加部门</span>
      </div>
    ),
  },
  {
    key: 'edit',
    label: (
      <div className="flex items-center">
        <SvgIcon name="create" size={16} className="mr-8" />
        <span className="font-normal">修改信息</span>
      </div>
    ),
  },
  {
    key: 'delete',
    label: (
      <div className="flex items-center">
        <SvgIcon name="restore_from_trash" size={16} className="mr-8" />
        <span className="font-normal">删除</span>
      </div>
    ),
  },
];

// model click event should not propagate to parent nodes
// this is an bug of lego UI modal
function stopModalClickPropagate(e: React.MouseEvent) {
  e.stopPropagation();
}

function DepartmentNode({ node, store }: NodeRenderProps<Department>): JSX.Element | null {
  const [showModal, toggleModal] = useState(false);
  const [departmentToEdit, setDepartment] = useState(node.data);

  function onAdd() {
    setDepartment({ id: '', departmentName: '', pid: node.data.id, superID: '', grade: 0 });
    toggleModal(true);
  }

  function onEdit() {
    setDepartment(node.data);
    toggleModal(true);
  }

  function onDelete() {
    const currentModal = Modal.open({
      title: '删除',
      okType: 'danger',
      okText: '确认删除',
      width: 632,
      className: 'static-modal',
      onOk: () => {
        Modal.close(currentModal);
        deleteDEP(node.id).then(({ code, msg }) => {
          if (!code) {
            Message.success({ content: '删除成功' });
            store.deleteNode(node);
            return;
          }

          Message.error(msg || '');
        });
      },
      content: (<div>确定要删除<span className="mx-4 text-16
      font-semibold text-gray-900">{node.data.departmentName}</span>吗？</div>),
    });
  }

  return (
    <div className="flex flex-grow max-w-full">
      <span className="truncate mr-auto" title={node.name}>
        {node.name}
      </span>
      <Authorized authority={['accessControl/mailList/manage']}>
        <MoreMenu
          menus={MENUS}
          placement="bottom-end"
          className="opacity-0 group-hover:opacity-100"
          onChange={(key) => {
            if (key === 'add') {
              onAdd();
              return;
            }

            if (key === 'edit') {
              onEdit();
              return;
            }

            onDelete();
          }}
        />
      </Authorized>
      {
        showModal && (
          <span onClick={stopModalClickPropagate}>
            <EditDepartment
              department={departmentToEdit}
              closeModal={() => toggleModal(false)}
            />
          </span>
        )
      }
    </div>
  );
}

export default observer(DepartmentNode);

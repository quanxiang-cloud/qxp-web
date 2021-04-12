import React, { useState } from 'react';
import { observer } from 'mobx-react';

import MoreMenu, { MenuItem } from '@c/more-menu';
import Authorized from '@c/authorized';
import Icon from '@c/icon';
import { NodeRenderProps } from '@c/headless-tree/types';

import EditDepartment from './edit-department';
import DeleteDepartment from './delete-department';

const MENUS: MenuItem<string>[] = [
  {
    key: 'add',
    label: (
      <div className="flex items-center">
        <Icon name="device_hub" size={16} className="mr-8" />
        <span className="font-normal">添加部门</span>
      </div>
    ),
  },
  {
    key: 'edit',
    label: (
      <div className="flex items-center">
        <Icon name="create" size={16} className="mr-8" />
        <span className="font-normal">修改信息</span>
      </div>
    ),
  },
  {
    key: 'delete',
    label: (
      <div className="flex items-center">
        <Icon name="restore_from_trash" size={16} className="mr-8" />
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

type OpenedModal = '' | 'edit_modal' | 'delete_modal';

function DepartmentNode({ node, store }: NodeRenderProps<Department>): JSX.Element | null {
  const [modalType, setModalType] = useState<OpenedModal>('');
  const [departmentToEdit, setDepartment] = useState(node.data);

  function onAdd() {
    setDepartment({ id: '', departmentName: '', pid: node.data.id, superID: '', grade: 0 });
    openModal('edit_modal');
  }

  function onEdit() {
    setDepartment(node.data);
    openModal('edit_modal');
  }

  function onDelete() {
    openModal('delete_modal');
  }

  function openModal(type: OpenedModal) {
    setModalType(type);
  }

  function closeModal() {
    setModalType('');
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
        modalType === 'edit_modal' && (
          <span onClick={stopModalClickPropagate}>
            <EditDepartment
              department={departmentToEdit}
              closeModal={closeModal}
            />
          </span>
        )
      }
      {
        modalType === 'delete_modal' && (
          <span onClick={stopModalClickPropagate}>
            <DeleteDepartment
              node={node}
              store={store}
              closeModal={closeModal}
            />
          </span>
        )
      }
    </div>
  );
}

export default observer(DepartmentNode);

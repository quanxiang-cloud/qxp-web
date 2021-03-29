import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { Icon, Modal, Message } from '@QCFE/lego-ui';
import { useQueryClient } from 'react-query';

import MoreMenu, { MenuItem } from '@c/more-menu';
import { NodeRenderProps } from '@c/headless-tree/types';
import Authorized from '@clients/common/component/authorized';

import EditDepartment from './edit-department';
import { deleteDEP } from '../api';

const MENUS: MenuItem<string>[] = [
  {
    key: 'add',
    label: (
      <div className="flex items-center"><Icon name="add" className="mr-4" />添加部门</div>
    ),
  },
  {
    key: 'edit',
    label: (
      <div className="flex items-center"><Icon name="pen" className="mr-4" />修改信息</div>
    ),
  },
  {
    key: 'delete',
    label: (
      <div className="flex items-center"><Icon name="trash" className="mr-4" />删除部门</div>
    ),
  },
];

// model click event should not propagate to parent nodes
// this is an bug of lego UI modal
function stopModalClickPropagate(e: React.MouseEvent) {
  e.stopPropagation();
}

function DepartmentNode({ node }: NodeRenderProps<IDepartment>): JSX.Element {
  const [showModal, toggleModal] = useState(false);
  const [departmentToEdit, setDepartment] = useState(node.data);
  const queryClient = useQueryClient();


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
            queryClient.invalidateQueries('getERPTree');
            return;
          }

          Message.error(msg || '');
        });
      },
      content: (<div>确定要删除<span className="mx-2 text-16
      font-semibold text-gray-900">{node.data.departmentName}</span>吗？</div>),
    });
  }

  return (
    <div className="flex flex-grow max-w-full">
      <span className="truncate mr-auto">
        {node.name}
      </span>
      <Authorized authority={['accessControl/maillist/manage']}>
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
